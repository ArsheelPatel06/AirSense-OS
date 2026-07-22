"""
FeatureVector — Merged CPCB + Weather input for Hybrid Intelligence.

This is the final output of the Feature Builder layer.
Every row in the Feature Store is a FeatureVector.

The Hybrid Intelligence ML models consume FeatureVectors directly.
"""
from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class FeatureVector:
    """
    Merged air quality + weather feature vector.

    This is the canonical input for the Hybrid Intelligence ML layer.

    Pollutant units : µg/m³ (except CO = mg/m³)
    Weather units   : metric (°C, hPa, m/s, m, mm)
    AQI             : 0–500 IND-AQI scale
    """

    # ── Identity ──────────────────────────────────────────────────────────────
    timestamp: str
    station_id: str = ""
    station_name: str = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city: str = ""
    state: str = ""

    # ── Pollutants (µg/m³ unless noted) ──────────────────────────────────────
    pm25: Optional[float] = None
    pm10: Optional[float] = None
    no2: Optional[float] = None
    so2: Optional[float] = None
    co: Optional[float] = None    # mg/m³
    o3: Optional[float] = None
    nh3: Optional[float] = None

    # ── Weather ───────────────────────────────────────────────────────────────
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    pressure: Optional[float] = None
    wind_speed: Optional[float] = None
    wind_direction: Optional[float] = None
    visibility: Optional[float] = None
    rain: Optional[float] = None
    cloud_cover: Optional[float] = None

    # ── AQI ───────────────────────────────────────────────────────────────────
    official_aqi: Optional[int] = None          # From CPCB bulletin
    calculated_aqi: Optional[int] = None        # From AQI Engine
    prominent_pollutant: str = ""
    aqi_category: str = ""
    aqi_verified: Optional[bool] = None         # True if |official - calculated| <= 1
    aqi_delta: Optional[int] = None             # official_aqi - calculated_aqi

    # ── Meta ──────────────────────────────────────────────────────────────────
    quality_score: float = 0.0
    source_ids: list[str] = field(default_factory=list)
    ingested_at: str = field(
        default_factory=lambda: datetime.utcnow().isoformat()
    )

    def to_dict(self) -> dict:
        return asdict(self)

    @property
    def is_valid(self) -> bool:
        """A FeatureVector is valid if it has at least PM2.5 or PM10 AND a timestamp."""
        return bool(self.timestamp) and (self.pm25 is not None or self.pm10 is not None)
