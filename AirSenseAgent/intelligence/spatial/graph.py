"""
Spatial Graph.

Models the spatial relationships between CPCB monitoring stations.
Pollution does not respect administrative boundaries — it travels via wind.

The SpatialGraph enables:
  - Finding upstream wind neighbors for a station
  - Weighted interpolation for missing sensor recovery
  - Eventually: Graph Neural Networks for spatially-aware forecasting

Usage:
    from intelligence.spatial.graph import SpatialGraph

    graph = SpatialGraph()
    graph.add_station("DL001", lat=28.65, lon=77.23, city="Delhi")
    graph.add_station("DL002", lat=28.53, lon=77.19, city="Delhi")
    neighbors = graph.get_spatial_neighbors("DL001", radius_km=50)
"""
from __future__ import annotations

import logging
import math
from dataclasses import dataclass, field
from typing import Optional

logger = logging.getLogger(__name__)

_R_EARTH_KM = 6371.0


@dataclass
class Station:
    station_id: str
    latitude: float
    longitude: float
    city: str = ""
    state: str = ""
    latest_readings: dict[str, float] = field(default_factory=dict)


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Haversine distance in km between two lat/lon points."""
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2
    return 2 * _R_EARTH_KM * math.asin(math.sqrt(a))


def _bearing_degrees(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Bearing (0–360°) from point 1 to point 2."""
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dlam = math.radians(lon2 - lon1)
    x = math.sin(dlam) * math.cos(phi2)
    y = math.cos(phi1) * math.sin(phi2) - math.sin(phi1) * math.cos(phi2) * math.cos(dlam)
    bearing = math.degrees(math.atan2(x, y))
    return (bearing + 360) % 360


class SpatialGraph:
    """
    A graph of monitoring stations connected by spatial relationships.
    """

    def __init__(self):
        self._stations: dict[str, Station] = {}

    def add_station(self, station_id: str, lat: float, lon: float,
                    city: str = "", state: str = "") -> None:
        self._stations[station_id] = Station(
            station_id=station_id,
            latitude=lat,
            longitude=lon,
            city=city,
            state=state,
        )

    def update_readings(self, station_id: str, readings: dict[str, float]) -> None:
        """Update live sensor readings for a station."""
        if station_id not in self._stations:
            raise KeyError(f"Station '{station_id}' not registered in SpatialGraph.")
        self._stations[station_id].latest_readings.update(readings)

    def get_spatial_neighbors(self, station_id: str, radius_km: float = 50.0) -> list[dict]:
        """
        Return all stations within radius_km, sorted by distance.

        Returns:
            List of dicts with keys: station_id, distance_km, bearing_degrees, latest_readings
        """
        if station_id not in self._stations:
            raise KeyError(f"Station '{station_id}' not registered.")

        src = self._stations[station_id]
        neighbors = []
        for sid, station in self._stations.items():
            if sid == station_id:
                continue
            dist = _haversine_km(src.latitude, src.longitude, station.latitude, station.longitude)
            if dist <= radius_km:
                bearing = _bearing_degrees(src.latitude, src.longitude, station.latitude, station.longitude)
                neighbors.append({
                    "station_id": sid,
                    "distance_km": round(dist, 2),
                    "bearing_degrees": round(bearing, 1),
                    "city": station.city,
                    "latest_readings": station.latest_readings,
                })

        neighbors.sort(key=lambda x: x["distance_km"])
        return neighbors

    def get_upstream_neighbors(self, station_id: str, wind_direction: float,
                               radius_km: float = 100.0, cone_deg: float = 60.0) -> list[dict]:
        """
        Return stations likely upwind of the target station.

        Args:
            wind_direction: Current wind direction AT the target station (0–360°).
            cone_deg: Half-angle of the upwind cone to search within.

        Returns:
            Neighbors that fall within the upwind cone.
        """
        # Upwind means pollution is coming from the opposite direction of wind
        upwind_bearing = (wind_direction + 180) % 360
        all_neighbors = self.get_spatial_neighbors(station_id, radius_km)
        upstream = []
        for n in all_neighbors:
            # Smallest angular difference
            diff = abs((n["bearing_degrees"] - upwind_bearing + 180) % 360 - 180)
            if diff <= cone_deg:
                n["angular_offset"] = round(diff, 1)
                upstream.append(n)

        upstream.sort(key=lambda x: x["distance_km"])
        return upstream

    def impute_missing(self, station_id: str, feature: str,
                       radius_km: float = 75.0) -> Optional[float]:
        """
        Estimate a missing sensor reading using inverse-distance weighted average
        from neighboring stations.

        Returns:
            Estimated value, or None if no neighbors have data.
        """
        neighbors = self.get_spatial_neighbors(station_id, radius_km)
        weighted_sum = 0.0
        weight_total = 0.0

        for n in neighbors:
            val = n["latest_readings"].get(feature)
            if val is not None and n["distance_km"] > 0:
                w = 1.0 / n["distance_km"]
                weighted_sum += val * w
                weight_total += w

        if weight_total == 0:
            logger.warning(f"[SpatialGraph] No neighbors with '{feature}' data for '{station_id}'.")
            return None

        estimate = weighted_sum / weight_total
        logger.info(f"[SpatialGraph] Imputed '{feature}' for '{station_id}': {estimate:.2f}")
        return estimate

    def list_stations(self) -> list[str]:
        return list(self._stations.keys())
