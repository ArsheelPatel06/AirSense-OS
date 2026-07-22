"""
Sentinel-5P Provider Package.

Strategy: DO NOT download raw NetCDF scenes by default.
One Sentinel product = hundreds of megabytes. Instead:

    GEEProvider      – Google Earth Engine (returns processed feature values)
    CopernicusAPIProvider – Copernicus Data Space subset API
    RawNetCDFProvider    – raw product download (advanced, opt-in only)

Usage:
    # Default (prototype / production):
    provider = GEEProvider(config)

    # Subset API (no GEE account needed):
    provider = CopernicusAPIProvider(config)

    # Raw download (only when image-processing pipeline is ready):
    provider = RawNetCDFProvider(config)
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from data.providers.base_provider import BaseProvider, ProviderMetadata


# ---------------------------------------------------------------------------
# 1. Google Earth Engine provider  (recommended default)
# ---------------------------------------------------------------------------

class GEEProvider(BaseProvider):
    """
    Queries Google Earth Engine for Sentinel-5P aggregated values.

    Returns a processed feature dict (e.g. mean NO2, O3, CH4 over a region),
    NOT raw imagery. This avoids unmanageable storage growth.

    Requires: pip install earthengine-api
    Config  : { "service_account": "...", "key_file": "/path/to/key.json" }
    """

    def __init__(self, config: dict | None = None):
        super().__init__(name="GEE_Sentinel5P", config=config or {})
        self._last_meta: ProviderMetadata | None = None

    def connect(self) -> None:
        import ee  # type: ignore
        service_account = self.config.get("service_account", "")
        key_file = self.config.get("key_file", "")
        if service_account and key_file:
            credentials = ee.ServiceAccountCredentials(service_account, key_file)
            ee.Initialize(credentials)
        else:
            ee.Authenticate()
            ee.Initialize()
        self._connected = True

    def authenticate(self) -> None:
        # Auth is handled inside connect() for GEE.
        pass

    def fetch(self, pollutant: str = "NO2", region: dict | None = None,
              start_date: str = "2026-07-01", end_date: str = "2026-07-22",
              **kwargs) -> dict:
        """
        Compute mean pollutant concentration over a region and date range.

        Args:
            pollutant: One of NO2, O3, CH4, SO2, CO, HCHO, AER_AI
            region   : GeoJSON-like dict with geometry. Defaults to India bbox.
            start_date / end_date: ISO date strings.

        Returns:
            dict with { pollutant, mean_value, unit, region, period }
        """
        import ee  # type: ignore

        band_map = {
            "NO2": ("COPERNICUS/S5P/NRTI/L3_NO2", "NO2_column_number_density"),
            "O3":  ("COPERNICUS/S5P/NRTI/L3_O3",  "O3_column_number_density"),
            "CH4": ("COPERNICUS/S5P/NRTI/L3_CH4", "CH4_column_volume_mixing_ratio_dry_air"),
            "SO2": ("COPERNICUS/S5P/NRTI/L3_SO2", "SO2_column_number_density"),
            "CO":  ("COPERNICUS/S5P/NRTI/L3_CO",  "CO_column_number_density"),
        }
        if pollutant not in band_map:
            raise ValueError(f"Unsupported pollutant: {pollutant}. Choose from {list(band_map)}")

        collection_id, band = band_map[pollutant]
        if region is None:
            region = ee.Geometry.Rectangle([68.0, 8.0, 97.0, 37.0])  # India bbox

        collection = (
            ee.ImageCollection(collection_id)
            .filterDate(start_date, end_date)
            .select(band)
        )
        mean_image = collection.mean()
        stats = mean_image.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=region,
            scale=10_000,
            maxPixels=1e9,
        )
        result = {
            "pollutant": pollutant,
            "band": band,
            "mean_value": stats.getInfo().get(band),
            "unit": "mol/m²",
            "period": f"{start_date}/{end_date}",
            "source": collection_id,
        }

        checksum = hashlib.md5(json.dumps(result, sort_keys=True).encode()).hexdigest()
        self._last_meta = ProviderMetadata(
            provider=self.name,
            dataset=f"sentinel5p_{pollutant.lower()}",
            rows=1,
            checksum=checksum,
            quality=99.0,
            source_url=f"https://developers.google.com/earth-engine/datasets/catalog/{collection_id.replace('/', '_')}",
        )
        return result

    def metadata(self) -> ProviderMetadata:
        if not self._last_meta:
            raise RuntimeError("Call fetch() before metadata().")
        return self._last_meta


# ---------------------------------------------------------------------------
# 2. Copernicus Data Space subset API
# ---------------------------------------------------------------------------

class CopernicusAPIProvider(BaseProvider):
    """
    Copernicus Data Space API — returns processed, pre-aggregated values.
    No raw scene downloads. No GEE account required.

    Config: { "client_id": "...", "client_secret": "..." }
    """

    TOKEN_URL = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
    BASE_URL  = "https://sh.dataspace.copernicus.eu/api/v1/statistics"

    def __init__(self, config: dict | None = None):
        super().__init__(name="CopernicusAPI", config=config or {})
        self._token: str = ""
        self._session = None
        self._last_meta: ProviderMetadata | None = None

    def connect(self) -> None:
        import requests
        self._session = requests.Session()
        self._connected = True

    def authenticate(self) -> None:
        import requests
        resp = requests.post(self.TOKEN_URL, data={
            "grant_type": "client_credentials",
            "client_id": self.config.get("client_id", ""),
            "client_secret": self.config.get("client_secret", ""),
        })
        resp.raise_for_status()
        self._token = resp.json()["access_token"]
        self._session.headers.update({"Authorization": f"Bearer {self._token}"})

    def fetch(self, bbox: list[float] | None = None, pollutant: str = "NO2",
              start_date: str = "2026-07-01", end_date: str = "2026-07-22",
              **kwargs) -> dict:
        """Fetch statistics for a bounding box via the Statistical API."""
        bbox = bbox or [68.0, 8.0, 97.0, 37.0]
        payload = {
            "input": {
                "bounds": {"bbox": bbox},
                "data": [{"type": "sentinel-5p-l2"}],
            },
            "aggregation": {
                "timeRange": {"from": f"{start_date}T00:00:00Z", "to": f"{end_date}T23:59:59Z"},
                "aggregationInterval": {"of": "P1D"},
                "evalscript": f"//VERSION=3\nfunction setup(){{return{{input:['{pollutant}'],output:{{bands:1}}}}}}\nfunction evaluatePixel(s){{return[s.{pollutant}]}}",
            },
        }
        resp = self._session.post(self.BASE_URL, json=payload, timeout=60)
        resp.raise_for_status()
        data = resp.json()

        checksum = hashlib.md5(json.dumps(data, sort_keys=True).encode()).hexdigest()
        self._last_meta = ProviderMetadata(
            provider=self.name,
            dataset=f"copernicus_{pollutant.lower()}",
            rows=len(data.get("data", [])),
            checksum=checksum,
            quality=99.0,
            source_url=self.BASE_URL,
        )
        return data

    def metadata(self) -> ProviderMetadata:
        if not self._last_meta:
            raise RuntimeError("Call fetch() before metadata().")
        return self._last_meta

    def close(self) -> None:
        if self._session:
            self._session.close()
        super().close()


# ---------------------------------------------------------------------------
# 3. Raw NetCDF download  (advanced, opt-in only)
# ---------------------------------------------------------------------------

class RawNetCDFProvider(BaseProvider):
    """
    Downloads raw Sentinel-5P NetCDF products from Copernicus Data Space.

    WARNING: Each product can be 200MB–4GB. Only activate when a full
    image-processing pipeline exists. Do NOT use as the default path.

    Config: { "client_id": "...", "client_secret": "...", "output_dir": "..." }
    """

    SEARCH_URL = "https://catalogue.dataspace.copernicus.eu/odata/v1/Products"

    def __init__(self, config: dict | None = None):
        super().__init__(name="RawNetCDF", config=config or {})
        self._output_dir = Path(self.config.get("output_dir", "data/lake/raw/sentinel"))
        self._token: str = ""
        self._session = None
        self._last_meta: ProviderMetadata | None = None

    def connect(self) -> None:
        import requests
        self._session = requests.Session()
        self._output_dir.mkdir(parents=True, exist_ok=True)
        self._connected = True

    def authenticate(self) -> None:
        import requests
        resp = requests.post(
            "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token",
            data={
                "grant_type": "client_credentials",
                "client_id": self.config.get("client_id", ""),
                "client_secret": self.config.get("client_secret", ""),
            },
        )
        resp.raise_for_status()
        self._token = resp.json()["access_token"]
        self._session.headers.update({"Authorization": f"Bearer {self._token}"})

    def fetch(self, product_name: str = "", **kwargs) -> Path:
        """Download a single product by name and return its local path."""
        query = f"$filter=Name eq '{product_name}'&$top=1"
        resp = self._session.get(f"{self.SEARCH_URL}?{query}", timeout=30)
        resp.raise_for_status()
        products = resp.json().get("value", [])
        if not products:
            raise ValueError(f"Product not found: {product_name}")

        product_id = products[0]["Id"]
        download_url = f"https://zipper.dataspace.copernicus.eu/odata/v1/Products({product_id})/$value"
        out_path = self._output_dir / f"{product_name}.nc"

        with self._session.get(download_url, stream=True, timeout=300) as r:
            r.raise_for_status()
            with open(out_path, "wb") as f:
                for chunk in r.iter_content(chunk_size=8192):
                    f.write(chunk)

        checksum = hashlib.md5(out_path.read_bytes()).hexdigest()
        self._last_meta = ProviderMetadata(
            provider=self.name,
            dataset=product_name,
            rows=-1,
            checksum=checksum,
            quality=100.0,
            source_url=download_url,
        )
        return out_path

    def metadata(self) -> ProviderMetadata:
        if not self._last_meta:
            raise RuntimeError("Call fetch() before metadata().")
        return self._last_meta

    def close(self) -> None:
        if self._session:
            self._session.close()
        super().close()
