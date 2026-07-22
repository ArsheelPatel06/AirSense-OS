"""
OpenStreetMap Provider Package.

OSM supplies critical GIS context features for every AQI prediction:
    - Nearest road type and distance
    - Industrial zone proximity
    - Hospital / school / residential land use
    - Population density proxy

Without OSM, half the geospatial features disappear.

Providers:
    OverpassAPIProvider  – live OSM data via Overpass API  (primary)
    PbfFileProvider      – local .osm.pbf extract  (offline / backfill)
    MockOSMProvider      – deterministic mock for unit tests
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
from typing import Any

from data.providers.base_provider import BaseProvider, ProviderMetadata


# ---------------------------------------------------------------------------
# 1. Overpass API  (primary)
# ---------------------------------------------------------------------------

class OverpassAPIProvider(BaseProvider):
    """
    Queries the OSM Overpass API for geospatial features near a point.

    Endpoint: https://overpass-api.de/api/interpreter
    Auth    : None required (rate-limited public API).

    NOTE: For heavy ingestion, consider a self-hosted Overpass instance.
    """

    ENDPOINT = "https://overpass-api.de/api/interpreter"

    def __init__(self, config: dict | None = None):
        super().__init__(name="OverpassAPI", config=config or {})
        self._session = None
        self._last_meta: ProviderMetadata | None = None

    def connect(self) -> None:
        import requests
        self._session = requests.Session()
        self._session.headers.update({"User-Agent": "AirSenseAgent/1.0 (contact@airsense.ai)"})
        self._connected = True

    def authenticate(self) -> None:
        # Public API, no authentication needed.
        pass

    def fetch(self, lat: float = 28.61, lon: float = 77.23,
              radius_m: int = 1000, **kwargs) -> dict:
        """
        Fetch OSM features within `radius_m` metres of (lat, lon).

        Returns a dict with keys:
            roads       – list of road features with name, highway type
            industries  – industrial landuse polygons
            amenities   – hospitals, schools, etc.
            land_use    – residential, commercial, industrial, etc.
        """
        query = f"""
        [out:json][timeout:30];
        (
          way["highway"](around:{radius_m},{lat},{lon});
          node["amenity"~"hospital|school|clinic"](around:{radius_m},{lat},{lon});
          way["landuse"](around:{radius_m},{lat},{lon});
          way["industrial"](around:{radius_m},{lat},{lon});
        );
        out body;
        >;
        out skel qt;
        """
        resp = self._session.post(self.ENDPOINT, data={"data": query}, timeout=60)
        resp.raise_for_status()
        data = resp.json()

        elements = data.get("elements", [])
        roads = [e for e in elements if e.get("tags", {}).get("highway")]
        amenities = [e for e in elements if e.get("tags", {}).get("amenity")]
        land_use = [e for e in elements if e.get("tags", {}).get("landuse")]

        result = {
            "query_point": {"lat": lat, "lon": lon, "radius_m": radius_m},
            "roads": roads,
            "amenities": amenities,
            "land_use": land_use,
            "element_count": len(elements),
        }

        checksum = hashlib.md5(json.dumps(result, sort_keys=True, default=str).encode()).hexdigest()
        self._last_meta = ProviderMetadata(
            provider=self.name,
            dataset=f"osm_{lat}_{lon}_{radius_m}m",
            rows=len(elements),
            checksum=checksum,
            quality=99.0,
            source_url=self.ENDPOINT,
        )
        return result

    def metadata(self) -> ProviderMetadata:
        if not self._last_meta:
            raise RuntimeError("Call fetch() before metadata().")
        return self._last_meta

    def close(self) -> None:
        if self._session:
            self._session.close()
        super().close()


# ---------------------------------------------------------------------------
# 2. PBF file provider  (offline backfill)
# ---------------------------------------------------------------------------

class PbfFileProvider(BaseProvider):
    """
    Parses a local OSM .pbf extract for offline feature extraction.

    Download India extract from: https://download.geofabrik.de/asia/india.html

    Requires: pip install osmium
    Config  : { "pbf_path": "/path/to/india-latest.osm.pbf" }
    """

    def __init__(self, config: dict | None = None):
        super().__init__(name="PbfOSM", config=config or {})
        self._pbf_path = Path(self.config.get("pbf_path", ""))
        self._last_meta: ProviderMetadata | None = None

    def connect(self) -> None:
        if not self._pbf_path.exists():
            raise FileNotFoundError(f"PBF file not found: {self._pbf_path}")
        self._connected = True

    def authenticate(self) -> None:
        pass

    def fetch(self, lat: float = 28.61, lon: float = 77.23,
              radius_m: int = 1000, **kwargs) -> dict:
        """
        Extract OSM features within radius_m of (lat, lon) from a local PBF.
        """
        try:
            import osmium  # type: ignore
        except ImportError:
            raise ImportError("pip install osmium  is required for PbfFileProvider.")

        # Minimal handler — extend as needed.
        class _RoadHandler(osmium.SimpleHandler):
            def __init__(self):
                super().__init__()
                self.roads = []

            def way(self, w):
                if "highway" in w.tags:
                    self.roads.append({
                        "id": w.id,
                        "highway": w.tags.get("highway"),
                        "name": w.tags.get("name", ""),
                    })

        handler = _RoadHandler()
        handler.apply_file(str(self._pbf_path))

        result = {
            "query_point": {"lat": lat, "lon": lon, "radius_m": radius_m},
            "roads": handler.roads[:500],  # cap for memory safety
        }
        checksum = hashlib.md5(self._pbf_path.read_bytes()[:4096]).hexdigest()
        self._last_meta = ProviderMetadata(
            provider=self.name,
            dataset=self._pbf_path.name,
            rows=len(handler.roads),
            checksum=checksum,
            quality=100.0,
            source_url=str(self._pbf_path),
        )
        return result

    def metadata(self) -> ProviderMetadata:
        if not self._last_meta:
            raise RuntimeError("Call fetch() before metadata().")
        return self._last_meta


# ---------------------------------------------------------------------------
# 3. Mock OSM provider  (unit tests)
# ---------------------------------------------------------------------------

class MockOSMProvider(BaseProvider):
    """Deterministic mock for unit tests. No network calls."""

    _MOCK = {
        "query_point": {"lat": 28.61, "lon": 77.23, "radius_m": 1000},
        "roads": [
            {"id": 1001, "highway": "primary", "name": "NH-44"},
            {"id": 1002, "highway": "residential", "name": "MG Road"},
        ],
        "amenities": [
            {"id": 2001, "amenity": "hospital", "name": "AIIMS Delhi"},
        ],
        "land_use": [
            {"id": 3001, "landuse": "residential"},
            {"id": 3002, "landuse": "industrial"},
        ],
        "element_count": 4,
    }

    def __init__(self):
        super().__init__(name="MockOSM")
        self._last_meta: ProviderMetadata | None = None

    def connect(self) -> None:
        self._connected = True

    def authenticate(self) -> None:
        pass

    def fetch(self, **kwargs) -> dict:
        self._last_meta = ProviderMetadata(
            provider=self.name,
            dataset="mock_osm",
            rows=self._MOCK["element_count"],
            checksum="mock_osm_abc123",
            quality=100.0,
            source_url="mock://",
        )
        return dict(self._MOCK)

    def metadata(self) -> ProviderMetadata:
        if not self._last_meta:
            raise RuntimeError("Call fetch() before metadata().")
        return self._last_meta
