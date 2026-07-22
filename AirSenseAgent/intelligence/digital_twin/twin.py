"""
Digital Twin.

Maintains a live evolving state profile for every monitoring station.
A Digital Twin is AirSense's internal "memory" of a physical location:
  - What is the air quality right now?
  - What are the multi-horizon forecasts?
  - How confident are we?
  - What is the historical trend?

This is what makes AirSense a platform, not just a predictor.
"""
from __future__ import annotations

import logging
from collections import deque
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

logger = logging.getLogger(__name__)


@dataclass
class HorizonForecast:
    """A single forecast for a specific number of hours ahead."""
    hours_ahead: int
    predicted_aqi: float
    confidence: float          # 0–100%
    timestamp_utc: str = field(default_factory=lambda: datetime.utcnow().isoformat())


@dataclass
class StationState:
    """The full live state of a monitoring station."""
    station_id: str
    city: str
    state: str
    latitude: float
    longitude: float

    # Current Readings
    current_aqi: Optional[float] = None
    current_pm25: Optional[float] = None
    current_pm10: Optional[float] = None
    current_no2: Optional[float] = None
    current_temperature: Optional[float] = None
    current_humidity: Optional[float] = None
    aqi_category: str = ""
    dominant_pollutant: str = ""

    # Multi-Horizon Forecasts
    forecasts: list[HorizonForecast] = field(default_factory=list)

    # Alerts
    data_drift_detected: bool = False
    concept_drift_detected: bool = False

    # Timestamps
    last_updated_utc: str = field(default_factory=lambda: datetime.utcnow().isoformat())


class DigitalTwin:
    """
    Registry of live station Digital Twins.

    Maintains a circular buffer of historical readings per station
    and exposes the current snapshot for forecasting and dashboards.

    Usage:
        twin = DigitalTwin()
        twin.upsert_state("DL001", aqi=145.0, pm25=65.0, city="Delhi", ...)
        snapshot = twin.get_snapshot("DL001")
    """

    def __init__(self, history_depth: int = 72):
        """
        Args:
            history_depth: How many AQI readings to retain per station (default: 72h).
        """
        self._states: dict[str, StationState] = {}
        self._history: dict[str, deque[dict]] = {}
        self.history_depth = history_depth

    def upsert_state(self,
                     station_id: str,
                     city: str = "",
                     state: str = "",
                     latitude: float = 0.0,
                     longitude: float = 0.0,
                     aqi: Optional[float] = None,
                     pm25: Optional[float] = None,
                     pm10: Optional[float] = None,
                     no2: Optional[float] = None,
                     temperature: Optional[float] = None,
                     humidity: Optional[float] = None,
                     aqi_category: str = "",
                     dominant_pollutant: str = "",
                     forecasts: list[HorizonForecast] | None = None,
                     data_drift: bool = False,
                     concept_drift: bool = False) -> None:
        """
        Update (or create) the Digital Twin for a station.
        Also appends the current reading to the historical buffer.
        """
        now = datetime.utcnow().isoformat()

        if station_id not in self._states:
            self._states[station_id] = StationState(
                station_id=station_id,
                city=city,
                state=state,
                latitude=latitude,
                longitude=longitude,
            )
            self._history[station_id] = deque(maxlen=self.history_depth)
            logger.info(f"[DigitalTwin] Created twin for station: {station_id}")

        twin = self._states[station_id]

        # Update live readings
        twin.current_aqi = aqi if aqi is not None else twin.current_aqi
        twin.current_pm25 = pm25 if pm25 is not None else twin.current_pm25
        twin.current_pm10 = pm10 if pm10 is not None else twin.current_pm10
        twin.current_no2 = no2 if no2 is not None else twin.current_no2
        twin.current_temperature = temperature if temperature is not None else twin.current_temperature
        twin.current_humidity = humidity if humidity is not None else twin.current_humidity
        twin.aqi_category = aqi_category or twin.aqi_category
        twin.dominant_pollutant = dominant_pollutant or twin.dominant_pollutant
        twin.forecasts = forecasts or twin.forecasts
        twin.data_drift_detected = data_drift
        twin.concept_drift_detected = concept_drift
        twin.last_updated_utc = now

        # Append to history
        self._history[station_id].append({
            "timestamp_utc": now,
            "aqi": aqi,
            "pm25": pm25,
        })

    def get_snapshot(self, station_id: str) -> StationState:
        """Return the current Digital Twin snapshot for a station."""
        if station_id not in self._states:
            raise KeyError(f"No Digital Twin found for station '{station_id}'.")
        return self._states[station_id]

    def get_history(self, station_id: str) -> list[dict]:
        """Return the recent history buffer for a station."""
        return list(self._history.get(station_id, []))

    def list_stations(self) -> list[str]:
        """Return all currently tracked station IDs."""
        return list(self._states.keys())

    def get_summary(self) -> list[dict]:
        """Compact summary for the MLOps dashboard."""
        return [
            {
                "station_id": sid,
                "city": s.city,
                "current_aqi": s.current_aqi,
                "aqi_category": s.aqi_category,
                "forecast_24h": next((f.predicted_aqi for f in s.forecasts if f.hours_ahead == 24), None),
                "data_drift": s.data_drift_detected,
                "concept_drift": s.concept_drift_detected,
                "last_updated_utc": s.last_updated_utc,
            }
            for sid, s in self._states.items()
        ]
