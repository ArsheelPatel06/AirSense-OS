"""
Weather Feature Builder.

Transforms raw WeatherContract records from providers into
normalized WeatherFeature vectors ready for the Feature Store.

Input : dict from OpenWeatherProvider (or any weather provider)
Output: WeatherFeature dataclass

The Feature Builder sits between the Processed Lake and the Feature Store.
It must never call providers directly.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class WeatherFeature:
    """
    Canonical weather feature vector.

    All fields use SI units (metric):
        temperature      °C
        pressure         hPa
        wind_speed       m/s
        wind_direction   degrees (meteorological, 0=N, 90=E)
        visibility       metres
        rain             mm/h
        cloud_cover      % (0–100)
        humidity         % (0–100)
    """
    timestamp: str
    latitude: float
    longitude: float

    # Core
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    pressure: Optional[float] = None

    # Wind
    wind_speed: Optional[float] = None
    wind_direction: Optional[float] = None
    wind_gust: Optional[float] = None

    # Precipitation
    rain: Optional[float] = None          # rain_1h from provider

    # Atmosphere
    cloud_cover: Optional[float] = None
    visibility: Optional[float] = None

    # Metadata
    provider: str = ""
    city: str = ""
    weather_main: str = ""
    quality_score: float = 0.0
    source_ids: list[str] = field(default_factory=list)


class WeatherFeatureBuilder:
    """
    Builds WeatherFeature vectors from normalized provider output.

    Usage:
        builder = WeatherFeatureBuilder()
        feature = builder.build(weather_dict)
    """

    REQUIRED_FIELDS = {"temperature", "humidity", "wind_speed"}

    def build(self, record: dict) -> WeatherFeature:
        """
        Build a WeatherFeature from a normalized provider record.

        Args:
            record: Output dict from any WeatherProvider._normalize() call.

        Returns:
            WeatherFeature with quality_score computed.
        """
        feature = WeatherFeature(
            timestamp=record.get("timestamp", datetime.utcnow().isoformat()),
            latitude=float(record.get("latitude", 0.0)),
            longitude=float(record.get("longitude", 0.0)),
            temperature=self._safe_float(record.get("temperature")),
            humidity=self._safe_float(record.get("humidity")),
            pressure=self._safe_float(record.get("pressure")),
            wind_speed=self._safe_float(record.get("wind_speed")),
            wind_direction=self._safe_float(record.get("wind_direction")),
            wind_gust=self._safe_float(record.get("wind_gust")),
            rain=self._safe_float(record.get("rain_1h", record.get("rain", 0.0))),
            cloud_cover=self._safe_float(record.get("cloud_cover")),
            visibility=self._safe_float(record.get("visibility")),
            provider=record.get("provider", ""),
            city=record.get("city", ""),
            weather_main=record.get("weather_main", ""),
        )
        feature.quality_score = self._score(feature)
        return feature

    def build_batch(self, records: list[dict]) -> list[WeatherFeature]:
        """Build multiple WeatherFeatures from a list of records."""
        return [self.build(r) for r in records]

    @staticmethod
    def _safe_float(val) -> Optional[float]:
        try:
            return float(val) if val is not None else None
        except (TypeError, ValueError):
            return None

    def _score(self, f: WeatherFeature) -> float:
        """Quality score based on required field completeness."""
        present = sum(1 for field in self.REQUIRED_FIELDS if getattr(f, field) is not None)
        return round((present / len(self.REQUIRED_FIELDS)) * 100, 1)
