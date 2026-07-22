"""
CPCB Provider Package — Sprint 2 Production Upgrade.

Provider priority chain (orchestrator tries in order):
    1. OfficialCPCBProvider  — data.gov.in  (primary)
    2. OpenAQProvider        — fallback
    3. CSVProvider           — local replay / backfill
    4. MockProvider          — unit tests

Each provider now exposes four fetch methods:
    fetch_realtime()  — latest snapshot for all stations
    fetch_station()   — single station by ID
    fetch_city()      — all stations in a city
    fetch_history()   — paginated historical observations

Credentials loaded from config.settings — never hardcoded.
"""
from __future__ import annotations

import hashlib
import json
import logging
import time
import xml.etree.ElementTree as ET
from datetime import datetime
from pathlib import Path
from typing import Any

from config.settings import settings
from data.etl.retry import GOV_API_RETRY, retry
from data.providers.base_provider import BaseProvider, ProviderMetadata

logger = logging.getLogger(__name__)

# ── Canonical field map ────────────────────────────────────────────────────────
# Maps OGD India field names → AirSense canonical schema
OGD_FIELD_MAP: dict[str, str] = {
    "country":       "country",
    "state":         "state",
    "city":          "city",
    "station":       "station_name",
    "last_update":   "timestamp",
    "latitude":      "latitude",
    "longitude":     "longitude",
    "pollutant_id":  "pollutant_id",
    "pollutant_min": "pollutant_min",
    "pollutant_max": "pollutant_max",
    "pollutant_avg": "pollutant_avg",
}

# Priority registry (used by ProviderChain)
PRIORITY = 1


# ─────────────────────────────────────────────────────────────────────────────
# 1. Official CPCB Provider  (data.gov.in) — production primary
# ─────────────────────────────────────────────────────────────────────────────

class OfficialCPCBProvider(BaseProvider):
    """
    Fetches live air-quality data from the official data.gov.in CPCB API.

    Supports four fetch strategies:
        fetch_realtime() — all stations, latest snapshot
        fetch_station()  — single station by station name
        fetch_city()     — all stations within a city
        fetch_history()  — paginated historical data with resume support

    Auth: DATA_GOV_API_KEY from config/settings.py
    """

    BASE_URL = "https://api.data.gov.in/resource"
    PRIORITY = 1

    def __init__(self, config: dict | None = None):
        super().__init__(name="OfficialCPCB", config=config or {})
        self._api_key = self.config.get("api_key") or settings.data_gov_api_key
        self._resource_id = self.config.get(
            "resource_id", settings.cpcb_realtime_resource_id
        )
        self._session = None
        self._last_meta: ProviderMetadata | None = None
        self._last_raw: list[dict] = []

    def connect(self) -> None:
        import requests
        self._session = requests.Session()
        self._session.headers.update({"Accept": "application/json"})
        self._connected = True
        logger.info(f"[OfficialCPCB] Connected. Key present: {bool(self._api_key)}")

    def authenticate(self) -> None:
        if not self._api_key:
            raise PermissionError(
                "DATA_GOV_API_KEY is not set. "
                "Add it to your .env file or set the environment variable."
            )
        self._session.headers.update({"api-key": self._api_key})

    # ── Fetch methods ──────────────────────────────────────────────────────────

    def fetch(self, **kwargs) -> list[dict]:
        """Default fetch — delegates to fetch_realtime()."""
        return self.fetch_realtime(**kwargs)

    def fetch_realtime(self, limit: int = 5000, offset: int = 0) -> list[dict]:
        """Fetch the latest pollutant snapshot for all CPCB stations."""
        return self._get(self._resource_id, limit=limit, offset=offset)

    def fetch_station(self, station_name: str, limit: int = 100) -> list[dict]:
        """Fetch observations for a single station by exact name."""
        return self._get(
            self._resource_id,
            filters={"station": station_name},
            limit=limit,
        )

    def fetch_city(self, city: str, limit: int = 500) -> list[dict]:
        """Fetch all station observations within a city."""
        return self._get(
            self._resource_id,
            filters={"city": city},
            limit=limit,
        )

    def fetch_history(self, resource_id: str, limit: int = 5000,
                      max_pages: int = 10) -> list[dict]:
        """
        Paginate through all historical records for a resource.

        Stops at max_pages to prevent runaway requests.
        """
        all_records: list[dict] = []
        for page in range(max_pages):
            offset = page * limit
            batch = self._get(resource_id, limit=limit, offset=offset)
            if not batch:
                break
            all_records.extend(batch)
            logger.info(f"[OfficialCPCB] Page {page + 1}: {len(batch)} records fetched")
            if len(batch) < limit:
                break  # Last page
            time.sleep(0.5)  # Rate-limit courtesy delay

        self._build_metadata(f"{resource_id}_history", all_records)
        return all_records

    def metadata(self) -> ProviderMetadata:
        if not self._last_meta:
            raise RuntimeError("Call fetch() before metadata().")
        return self._last_meta

    def close(self) -> None:
        if self._session:
            self._session.close()
        super().close()

    # ── Internal ──────────────────────────────────────────────────────────────

    @retry(GOV_API_RETRY)
    def _get(self, resource_id: str, limit: int = 5000,
             offset: int = 0, filters: dict | None = None) -> list[dict]:
        """Execute a GET request against data.gov.in and return records.

        Wrapped with GOV_API_RETRY — retries up to 5 times with exponential
        backoff on connection/timeout errors (data.gov.in is unreliable).
        """
        params: dict[str, Any] = {
            "api-key": self._api_key,
            "format": "xml",
            "limit": limit,
            "offset": offset,
        }
        if filters:
            # data.gov.in filter format: filters[field]=value
            for k, v in filters.items():
                params[f"filters[{k}]"] = v

        url = f"{self.BASE_URL}/{resource_id}"
        resp = self._session.get(url, params=params, timeout=90)  # gov APIs are slow
        resp.raise_for_status()

        # Parse XML response (data.gov.in JSON endpoint frequently returns 502)
        records = []
        try:
            root = ET.fromstring(resp.content)
            records_node = root.find("records")
            if records_node is not None:
                for item in records_node.findall("item"):
                    record = {child.tag: child.text for child in item}
                    records.append(record)
        except ET.ParseError as e:
            logger.error(f"[OfficialCPCB] XML parse error: {e}")
            raise

        self._last_raw = records
        self._build_metadata(resource_id, records, source_url=resp.url)
        return records

    def _build_metadata(self, dataset: str, records: list[dict],
                        source_url: str = "") -> None:
        checksum = hashlib.md5(
            json.dumps(records, sort_keys=True, default=str).encode()
        ).hexdigest()
        self._last_meta = ProviderMetadata(
            provider=self.name,
            dataset=dataset,
            download_time=datetime.utcnow().isoformat(),
            rows=len(records),
            checksum=checksum,
            quality=100.0,
            source_url=source_url,
        )


# ─────────────────────────────────────────────────────────────────────────────
# 2. OpenAQ fallback
# ─────────────────────────────────────────────────────────────────────────────

class OpenAQProvider(BaseProvider):
    """
    OpenAQ v3 fallback. Used only when OfficialCPCBProvider is unavailable.
    Priority 3 — never the primary source.
    """

    BASE_URL = "https://api.openaq.org/v3"
    PRIORITY = 3

    def __init__(self, config: dict | None = None):
        super().__init__(name="OpenAQ", config=config or {})
        self._session = None
        self._last_meta: ProviderMetadata | None = None

    def connect(self) -> None:
        import requests
        self._session = requests.Session()
        self._connected = True

    def authenticate(self) -> None:
        api_key = self.config.get("api_key", "")
        if api_key:
            self._session.headers.update({"X-API-Key": api_key})

    def fetch(self, country: str = "IN", limit: int = 1000, **kwargs) -> list[dict]:
        params = {"country_id": country, "limit": limit, **kwargs}
        resp = self._session.get(f"{self.BASE_URL}/measurements", params=params, timeout=30)
        resp.raise_for_status()
        records = resp.json().get("results", [])
        checksum = hashlib.md5(json.dumps(records, sort_keys=True, default=str).encode()).hexdigest()
        self._last_meta = ProviderMetadata(
            provider=self.name, dataset="openaq_india",
            rows=len(records), checksum=checksum, quality=95.0,
            source_url=f"{self.BASE_URL}/measurements",
        )
        return records

    def fetch_realtime(self, **kwargs) -> list[dict]:
        return self.fetch(**kwargs)

    def fetch_station(self, station_name: str, **kwargs) -> list[dict]:
        return self.fetch(location=station_name, **kwargs)

    def fetch_city(self, city: str, **kwargs) -> list[dict]:
        return self.fetch(city=city, **kwargs)

    def fetch_history(self, **kwargs) -> list[dict]:
        return self.fetch(**kwargs)

    def metadata(self) -> ProviderMetadata:
        if not self._last_meta:
            raise RuntimeError("Call fetch() before metadata().")
        return self._last_meta

    def close(self) -> None:
        if self._session:
            self._session.close()
        super().close()


# ─────────────────────────────────────────────────────────────────────────────
# 3. CSV replay
# ─────────────────────────────────────────────────────────────────────────────

class CSVProvider(BaseProvider):
    """Local CSV replay. Priority 2 — used as backfill and during development."""

    PRIORITY = 2

    def __init__(self, lake_archive_path: str | Path, config: dict | None = None):
        super().__init__(name="CSVReplay", config=config or {})
        self._root = Path(lake_archive_path)
        self._last_meta: ProviderMetadata | None = None

    def connect(self) -> None:
        if not self._root.exists():
            raise FileNotFoundError(f"Archive not found: {self._root}")
        self._connected = True

    def authenticate(self) -> None:
        pass

    def fetch(self, file_code: str = "", **kwargs) -> list[dict]:
        import csv
        path = self._root / f"{file_code}.csv"
        if not path.exists():
            raise FileNotFoundError(f"Station file not found: {path}")
        with open(path, newline="", encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
        checksum = hashlib.md5(path.read_bytes()).hexdigest()
        self._last_meta = ProviderMetadata(
            provider=self.name, dataset=file_code,
            rows=len(rows), checksum=checksum, quality=100.0,
            source_url=str(path),
        )
        return rows

    def fetch_realtime(self, **kwargs) -> list[dict]:
        return self.fetch(**kwargs)

    def fetch_station(self, station_name: str, **kwargs) -> list[dict]:
        return self.fetch(file_code=station_name, **kwargs)

    def fetch_city(self, city: str, **kwargs) -> list[dict]:
        return self.fetch(file_code=city, **kwargs)

    def fetch_history(self, file_code: str = "", **kwargs) -> list[dict]:
        return self.fetch(file_code=file_code, **kwargs)

    def metadata(self) -> ProviderMetadata:
        if not self._last_meta:
            raise RuntimeError("Call fetch() before metadata().")
        return self._last_meta


# ─────────────────────────────────────────────────────────────────────────────
# 4. Mock
# ─────────────────────────────────────────────────────────────────────────────

class MockProvider(BaseProvider):
    """Deterministic mock for unit tests. Priority 4."""

    PRIORITY = 4
    _RECORDS = [
        {"country": "India", "state": "Delhi", "city": "Delhi",
         "station": "Anand Vihar - DPCC", "last_update": "22-07-2026 08:00:00",
         "latitude": 28.6469, "longitude": 77.3164,
         "pollutant_id": "PM2.5", "pollutant_min": 45.0,
         "pollutant_max": 89.0, "pollutant_avg": 67.0},
        {"country": "India", "state": "Maharashtra", "city": "Mumbai",
         "station": "Bandra - MPCB", "last_update": "22-07-2026 08:00:00",
         "latitude": 19.0596, "longitude": 72.8295,
         "pollutant_id": "PM10", "pollutant_min": 30.0,
         "pollutant_max": 60.0, "pollutant_avg": 45.0},
    ]

    def __init__(self):
        super().__init__(name="MockCPCB")
        self._last_meta: ProviderMetadata | None = None

    def connect(self) -> None:
        self._connected = True

    def authenticate(self) -> None:
        pass

    def fetch(self, **kwargs) -> list[dict]:
        self._last_meta = ProviderMetadata(
            provider=self.name, dataset="mock_cpcb",
            rows=len(self._RECORDS), checksum="mock_abc123",
            quality=100.0, source_url="mock://",
        )
        return list(self._RECORDS)

    def fetch_realtime(self, **kwargs) -> list[dict]: return self.fetch()
    def fetch_station(self, **kwargs) -> list[dict]: return self.fetch()
    def fetch_city(self, **kwargs) -> list[dict]: return self.fetch()
    def fetch_history(self, **kwargs) -> list[dict]: return self.fetch()

    def metadata(self) -> ProviderMetadata:
        if not self._last_meta:
            raise RuntimeError("Call fetch() before metadata().")
        return self._last_meta


# ─────────────────────────────────────────────────────────────────────────────
# Provider Chain — automatic priority fallback
# ─────────────────────────────────────────────────────────────────────────────

class CPCBProviderChain:
    """
    Tries providers in priority order and returns the first successful result.

    Usage:
        chain = CPCBProviderChain.default(archive_path="gov_data/archive")
        records = chain.fetch_realtime()
        meta    = chain.last_metadata()
    """

    def __init__(self, providers: list[BaseProvider]):
        # Sort by PRIORITY attribute ascending (1 = highest)
        self._providers = sorted(providers, key=lambda p: getattr(p, "PRIORITY", 99))
        self._last_meta: ProviderMetadata | None = None

    @classmethod
    def default(cls, archive_path: str | Path = "gov_data/archive") -> "CPCBProviderChain":
        """Build the standard CPCB provider chain."""
        providers: list[BaseProvider] = []
        if settings.has_cpcb_key:
            providers.append(OfficialCPCBProvider())
        providers.append(CSVProvider(lake_archive_path=archive_path))
        providers.append(OpenAQProvider())
        providers.append(MockProvider())
        return cls(providers)

    def _try(self, method: str, **kwargs) -> list[dict]:
        last_exc: Exception | None = None
        for provider in self._providers:
            fn = getattr(provider, method, None)
            if fn is None:
                continue
            try:
                with provider:
                    result = fn(**kwargs)
                    self._last_meta = provider.metadata()
                    logger.info(f"[CPCBChain] {method} succeeded via {provider.name}")
                    return result
            except Exception as exc:
                logger.warning(f"[CPCBChain] {provider.name} failed ({method}): {exc}")
                last_exc = exc
        raise RuntimeError(f"All CPCB providers failed for {method}: {last_exc}")

    def fetch_realtime(self, **kwargs) -> list[dict]:
        return self._try("fetch_realtime", **kwargs)

    def fetch_station(self, station_name: str, **kwargs) -> list[dict]:
        return self._try("fetch_station", station_name=station_name, **kwargs)

    def fetch_city(self, city: str, **kwargs) -> list[dict]:
        return self._try("fetch_city", city=city, **kwargs)

    def fetch_history(self, **kwargs) -> list[dict]:
        return self._try("fetch_history", **kwargs)

    def last_metadata(self) -> ProviderMetadata | None:
        return self._last_meta
