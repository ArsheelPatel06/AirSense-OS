"""
IMD / Weather Provider Package — Sprint 2 Production Upgrade.

Provider priority chain:
    1. OpenWeatherProvider  — OpenWeatherMap API  (primary)
    2. IMDProvider          — official IMD  (when credentials available)
    3. ERA5Provider         — ECMWF reanalysis fallback
    4. OpenMeteoProvider    — free fallback
    5. CSVWeatherProvider   — local replay / offline

Credentials loaded from config.settings — never hardcoded.
"""
from __future__ import annotations

import hashlib
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any

from config.settings import settings
from data.providers.base_provider import BaseProvider, ProviderMetadata

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────────────────────
# 1. OpenWeather Provider — production primary
# ─────────────────────────────────────────────────────────────────────────────

class OpenWeatherProvider(BaseProvider):
    """
    OpenWeatherMap Current Weather API v2.5.

    Collects: Temperature, Humidity, Pressure, Wind Speed/Direction,
              Visibility, Rain, Cloud Cover, Sunrise, Sunset.

    Auth: OPENWEATHER_API_KEY from config/settings.py
    Priority: 1
    """

    PRIORITY = 1

    def __init__(self, config: dict | None = None):
        super().__init__(name="OpenWeather", config=config or {})
        self._api_key = self.config.get("api_key") or settings.openweather_api_key
        self._base_url = settings.openweather_base_url
        self._session = None
        self._last_meta: ProviderMetadata | None = None

    def connect(self) -> None:
        import requests
        self._session = requests.Session()
        self._connected = True
        logger.info(f"[OpenWeather] Connected. Key present: {bool(self._api_key)}")

    def authenticate(self) -> None:
        if not self._api_key:
            raise PermissionError(
                "OPENWEATHER_API_KEY is not set. Add it to your .env file."
            )

    def fetch(self, lat: float = 28.61, lon: float = 77.23, **kwargs) -> dict:
        """Fetch current weather for a lat/lon point."""
        return self.fetch_current(lat=lat, lon=lon)

    def fetch_current(self, lat: float, lon: float, units: str = "metric") -> dict:
        """
        Fetch current weather conditions.

        Returns a WeatherContract-ready dict with all normalised fields.
        """
        params = {
            "lat": lat, "lon": lon,
            "appid": self._api_key,
            "units": units,
        }
        resp = self._session.get(f"{self._base_url}/weather", params=params, timeout=20)
        resp.raise_for_status()
        raw = resp.json()
        normalized = self._normalize(raw, lat, lon)

        checksum = hashlib.md5(json.dumps(raw, sort_keys=True, default=str).encode()).hexdigest()
        self._last_meta = ProviderMetadata(
            provider=self.name,
            dataset=f"weather_{lat}_{lon}",
            rows=1,
            checksum=checksum,
            quality=100.0,
            source_url=f"{self._base_url}/weather",
        )
        return normalized

    def fetch_forecast(self, lat: float, lon: float,
                       hours: int = 24, units: str = "metric") -> list[dict]:
        """
        Fetch hourly weather forecast (up to 5 days / 40 data points).
        """
        params = {
            "lat": lat, "lon": lon,
            "appid": self._api_key,
            "units": units,
            "cnt": min(hours, 40),
        }
        resp = self._session.get(f"{self._base_url}/forecast", params=params, timeout=20)
        resp.raise_for_status()
        items = resp.json().get("list", [])
        normalized = [self._normalize_forecast_item(item, lat, lon) for item in items]

        checksum = hashlib.md5(json.dumps(items, sort_keys=True, default=str).encode()).hexdigest()
        self._last_meta = ProviderMetadata(
            provider=self.name,
            dataset=f"weather_forecast_{lat}_{lon}",
            rows=len(normalized),
            checksum=checksum,
            quality=100.0,
            source_url=f"{self._base_url}/forecast",
        )
        return normalized

    def metadata(self) -> ProviderMetadata:
        if not self._last_meta:
            raise RuntimeError("Call fetch() before metadata().")
        return self._last_meta

    def close(self) -> None:
        if self._session:
            self._session.close()
        super().close()

    # ── Normalisation ─────────────────────────────────────────────────────────

    @staticmethod
    def _normalize(raw: dict, lat: float, lon: float) -> dict:
        """Map OpenWeather current response → WeatherContract schema."""
        wind = raw.get("wind", {})
        rain = raw.get("rain", {})
        clouds = raw.get("clouds", {})
        sys = raw.get("sys", {})
        main = raw.get("main", {})

        return {
            "provider":        "OpenWeather",
            "timestamp":       datetime.utcfromtimestamp(raw.get("dt", 0)).isoformat(),
            "latitude":        lat,
            "longitude":       lon,
            "city":            raw.get("name", ""),
            # Core weather
            "temperature":     main.get("temp"),
            "feels_like":      main.get("feels_like"),
            "temp_min":        main.get("temp_min"),
            "temp_max":        main.get("temp_max"),
            "humidity":        main.get("humidity"),
            "pressure":        main.get("pressure"),
            "sea_level":       main.get("sea_level"),
            "grnd_level":      main.get("grnd_level"),
            # Wind
            "wind_speed":      wind.get("speed"),
            "wind_direction":  wind.get("deg"),
            "wind_gust":       wind.get("gust"),
            # Precipitation
            "rain_1h":         rain.get("1h", 0.0),
            "rain_3h":         rain.get("3h", 0.0),
            # Atmosphere
            "visibility":      raw.get("visibility"),
            "cloud_cover":     clouds.get("all"),
            # Astronomical
            "sunrise":         datetime.utcfromtimestamp(sys.get("sunrise", 0)).isoformat(),
            "sunset":          datetime.utcfromtimestamp(sys.get("sunset", 0)).isoformat(),
            # Description
            "weather_main":    raw.get("weather", [{}])[0].get("main", ""),
            "weather_desc":    raw.get("weather", [{}])[0].get("description", ""),
            "weather_icon":    raw.get("weather", [{}])[0].get("icon", ""),
        }

    @staticmethod
    def _normalize_forecast_item(item: dict, lat: float, lon: float) -> dict:
        wind = item.get("wind", {})
        rain = item.get("rain", {})
        clouds = item.get("clouds", {})
        main = item.get("main", {})
        return {
            "provider":       "OpenWeather",
            "timestamp":      item.get("dt_txt", ""),
            "latitude":       lat,
            "longitude":      lon,
            "temperature":    main.get("temp"),
            "humidity":       main.get("humidity"),
            "pressure":       main.get("pressure"),
            "wind_speed":     wind.get("speed"),
            "wind_direction": wind.get("deg"),
            "rain_3h":        rain.get("3h", 0.0),
            "cloud_cover":    clouds.get("all"),
            "visibility":     item.get("visibility"),
            "weather_main":   item.get("weather", [{}])[0].get("main", ""),
        }


# ─────────────────────────────────────────────────────────────────────────────
# 2. IMD  (stub — primary when credentials are obtained)
# ─────────────────────────────────────────────────────────────────────────────

class IMDProvider(BaseProvider):
    """Official IMD. Priority 2. Activate when credentials are available."""

    PRIORITY = 2

    def __init__(self, config: dict | None = None):
        super().__init__(name="IMD", config=config or {})
        self._last_meta: ProviderMetadata | None = None

    def connect(self) -> None:
        self._connected = True

    def authenticate(self) -> None:
        pass

    def fetch(self, **kwargs) -> dict:
        raise NotImplementedError(
            "IMD credentials not configured. Using OpenWeather as primary."
        )

    def metadata(self) -> ProviderMetadata:
        if not self._last_meta:
            raise RuntimeError("Call fetch() before metadata().")
        return self._last_meta


# ─────────────────────────────────────────────────────────────────────────────
# 3. Open-Meteo free fallback
# ─────────────────────────────────────────────────────────────────────────────

class OpenMeteoProvider(BaseProvider):
    """Open-Meteo free API. Priority 4. No auth required."""

    BASE_URL = "https://api.open-meteo.com/v1/forecast"
    PRIORITY = 4

    def __init__(self, config: dict | None = None):
        super().__init__(name="OpenMeteo", config=config or {})
        self._session = None
        self._last_meta: ProviderMetadata | None = None

    def connect(self) -> None:
        import requests
        self._session = requests.Session()
        self._connected = True

    def authenticate(self) -> None:
        pass

    def fetch(self, lat: float = 28.61, lon: float = 77.23, **kwargs) -> dict:
        params = {
            "latitude": lat, "longitude": lon,
            "hourly": [
                "temperature_2m", "relativehumidity_2m",
                "windspeed_10m", "winddirection_10m",
                "precipitation", "surface_pressure",
            ],
            "timezone": "Asia/Kolkata",
        }
        resp = self._session.get(self.BASE_URL, params=params, timeout=20)
        resp.raise_for_status()
        data = resp.json()
        checksum = hashlib.md5(json.dumps(data, sort_keys=True, default=str).encode()).hexdigest()
        self._last_meta = ProviderMetadata(
            provider=self.name, dataset="open_meteo",
            rows=len(data.get("hourly", {}).get("time", [])),
            checksum=checksum, quality=90.0, source_url=self.BASE_URL,
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


# ─────────────────────────────────────────────────────────────────────────────
# 4. CSV Weather replay
# ─────────────────────────────────────────────────────────────────────────────

class CSVWeatherProvider(BaseProvider):
    """Local CSV replay for weather data. Priority 5."""

    PRIORITY = 5

    def __init__(self, path: str | Path, config: dict | None = None):
        super().__init__(name="CSVWeather", config=config or {})
        self._path = Path(path)
        self._last_meta: ProviderMetadata | None = None

    def connect(self) -> None:
        if not self._path.exists():
            raise FileNotFoundError(self._path)
        self._connected = True

    def authenticate(self) -> None:
        pass

    def fetch(self, **kwargs) -> list[dict]:
        import csv
        with open(self._path, newline="", encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
        checksum = hashlib.md5(self._path.read_bytes()).hexdigest()
        self._last_meta = ProviderMetadata(
            provider=self.name, dataset=self._path.stem,
            rows=len(rows), checksum=checksum, quality=100.0,
            source_url=str(self._path),
        )
        return rows

    def metadata(self) -> ProviderMetadata:
        if not self._last_meta:
            raise RuntimeError("Call fetch() before metadata().")
        return self._last_meta


# ─────────────────────────────────────────────────────────────────────────────
# Weather Provider Chain — automatic priority fallback
# ─────────────────────────────────────────────────────────────────────────────

class WeatherProviderChain:
    """
    Tries weather providers in priority order.

    Priority:  OpenWeather(1) → IMD(2) → OpenMeteo(4)

    Usage:
        chain = WeatherProviderChain.default()
        weather = chain.fetch(lat=28.61, lon=77.23)
    """

    def __init__(self, providers: list[BaseProvider]):
        self._providers = sorted(providers, key=lambda p: getattr(p, "PRIORITY", 99))
        self._last_meta: ProviderMetadata | None = None

    @classmethod
    def default(cls) -> "WeatherProviderChain":
        providers: list[BaseProvider] = []
        if settings.has_weather_key:
            providers.append(OpenWeatherProvider())
        providers.append(OpenMeteoProvider())
        return cls(providers)

    def fetch(self, lat: float, lon: float, **kwargs) -> dict | list:
        last_exc: Exception | None = None
        for provider in self._providers:
            try:
                with provider:
                    result = provider.fetch(lat=lat, lon=lon, **kwargs)
                    self._last_meta = provider.metadata()
                    logger.info(f"[WeatherChain] fetch succeeded via {provider.name}")
                    return result
            except Exception as exc:
                logger.warning(f"[WeatherChain] {provider.name} failed: {exc}")
                last_exc = exc
        raise RuntimeError(f"All weather providers failed: {last_exc}")

    def last_metadata(self) -> ProviderMetadata | None:
        return self._last_meta
