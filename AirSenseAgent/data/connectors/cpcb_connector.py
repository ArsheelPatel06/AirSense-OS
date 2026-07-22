"""
CPCB Connector.

The first production connector in the AirSense Enterprise Framework.

Wires together:
    Provider  → any CPCBProvider (Official, OpenAQ, CSV, Mock)
    Lifecycle → fetch → cache → parse → validate → normalize → quality
                → provenance → store_raw → store_processed
    Retry     → GOV_API_RETRY wraps every fetch call

This connector never writes to the Feature Store.
The Orchestrator invokes it; the Feature Builder reads from the processed lake.

Usage:
    from data.providers.cpcb import CSVProvider
    from data.connectors.cpcb_connector import CPCBConnector

    provider = CSVProvider(lake_archive_path="data/lake/archive/cpcb_historical")
    connector = CPCBConnector(provider=provider)
    result = connector.run(file_code="DL001")

    print(result.rows_processed)
    print(result.quality_score)
"""
from __future__ import annotations

import logging
from datetime import datetime
from pathlib import Path
from typing import Any

from data.connectors.base_connector import BaseConnector
from data.etl.retry import GOV_API_RETRY, retry

logger = logging.getLogger(__name__)

# Required columns in the normalized CPCB schema
REQUIRED_COLUMNS = {
    "from_date", "to_date", "station_id",
    "pm25", "pm10", "no2",
}

# Full canonical column mapping  (raw name → normalized name)
COLUMN_MAP = {
    # Dates
    "From Date":    "from_date",
    "To Date":      "to_date",
    # Station identity (injected by CSVProvider from stations_info)
    "station":      "station_id",
    "station_id":   "station_id",
    "city":         "city",
    "state":        "state",
    "latitude":     "latitude",
    "longitude":    "longitude",
    # Pollutants
    "PM2.5 (ug/m3)":  "pm25",
    "PM10 (ug/m3)":   "pm10",
    "NO (ug/m3)":     "no",
    "NO2 (ug/m3)":    "no2",
    "NOx (ppb)":      "nox",
    "NH3 (ug/m3)":    "nh3",
    "SO2 (ug/m3)":    "so2",
    "CO (mg/m3)":     "co",
    "Ozone (ug/m3)":  "o3",
    "Benzene (ug/m3)":"benzene",
    "Toluene (ug/m3)":"toluene",
    "Xylene (ug/m3)": "xylene",
    # Meteorology
    "Temp (degree C)": "temperature",
    "RH (%)":          "humidity",
    "WS (m/s)":        "wind_speed",
    "WD (deg)":        "wind_direction",
    "SR (W/mt2)":      "solar_radiation",
    "BP (mmHg)":       "barometric_pressure",
    "RF (mm)":         "rainfall",
    "AT (degree C)":   "ambient_temp",
    "VWS (m/s)":       "vector_wind_speed",
    # Snapshot API fields
    "last_update":    "last_update",
    "pollutant_id":   "pollutant_id",
    "min_value":      "pollutant_min",
    "max_value":      "pollutant_max",
    "avg_value":      "pollutant_avg",
}

# Valid ranges for range-check quality scoring  {field: (lo, hi)}
VALID_RANGES = {
    "pm25":        (0.0,  1000.0),
    "pm10":        (0.0,  1500.0),
    "no2":         (0.0,  2000.0),
    "so2":         (0.0,  3000.0),
    "co":          (0.0,   100.0),
    "o3":          (0.0,  1000.0),
    "temperature": (-20.0,  60.0),
    "humidity":    (0.0,   100.0),
    "wind_speed":  (0.0,   100.0),
}


class CPCBConnector(BaseConnector):
    """
    Connector for Central Pollution Control Board (CPCB) air quality data.

    Works with any CPCBProvider — swap the provider to change the data source
    without touching this class.

    Quality scoring:
        - Completeness (non-null ratio) — 60% weight
        - Range validity                — 40% weight
        Score in [0.0, 100.0].
    """

    def __init__(self, provider: Any, lake_root: str | Path = "data/lake"):
        super().__init__(
            connector_id="cpcb",
            provider=provider,
            lake_root=lake_root,
        )

    # ------------------------------------------------------------------
    # Parse
    # ------------------------------------------------------------------

    def parse(self, raw: Any) -> list[dict]:
        """
        Accept raw data in two formats:
          1. List[dict]  — from OfficialCPCBProvider, OpenAQProvider, MockProvider
          2. Path        — (reserved for future binary formats)
        """
        if isinstance(raw, list):
            return raw
        raise TypeError(f"CPCBConnector.parse: unexpected raw type {type(raw)}")

    # ------------------------------------------------------------------
    # Validate
    # ------------------------------------------------------------------

    def validate(self, records: list[dict]) -> bool:
        """
        Basic data contract validation.

        Checks:
          - Records list is non-empty.
          - At least one record contains a pollution reading column.
        """
        if not records:
            logger.error("[cpcb] Validation failed: empty record set.")
            return False

        # Detect at least one pollution-related key in the first record
        first = records[0]
        known_pollution_keys = {
            "PM2.5 (ug/m3)", "PM10 (ug/m3)", "NO2 (ug/m3)",
            "pm25", "pm10", "no2",
            "pollutant_id", "pollutant_avg",
        }
        if not any(k in first for k in known_pollution_keys):
            logger.warning(
                "[cpcb] Validation warning: no known pollution column found in first record. "
                f"Keys present: {list(first.keys())[:10]}"
            )
            # Soft failure — continue with warning, don't abort.

        return True

    # ------------------------------------------------------------------
    # Normalize
    # ------------------------------------------------------------------

    def normalize(self, records: list[dict]) -> list[dict]:
        """
        Rename columns, coerce types, fill meta fields.

        Produces records conforming to the canonical CPCB schema.
        """
        normalized = []
        for row in records:
            norm = {}
            for raw_key, value in row.items():
                canonical = COLUMN_MAP.get(raw_key, raw_key.lower().replace(" ", "_"))
                norm[canonical] = self._coerce(canonical, value)

            # Inject ingestion timestamp
            norm["ingested_at"] = datetime.utcnow().isoformat()
            norm["data_source"] = self.provider.name
            normalized.append(norm)

        logger.debug(f"[cpcb] Normalized {len(normalized)} records.")
        return normalized

    # ------------------------------------------------------------------
    # Quality
    # ------------------------------------------------------------------

    def quality(self, records: list[dict]) -> float:
        """
        Compute quality score [0–100].

        60% — Completeness: fraction of non-null values across all fields.
        40% — Range validity: fraction of numeric fields within valid ranges.
        """
        if not records:
            return 0.0

        # Completeness
        total_cells = 0
        non_null_cells = 0
        for row in records:
            for val in row.values():
                total_cells += 1
                if val is not None and val != "" and val != "NaN":
                    non_null_cells += 1
        completeness = (non_null_cells / total_cells) if total_cells else 0.0

        # Range validity
        range_checks = 0
        range_passes = 0
        for row in records:
            for field_name, (lo, hi) in VALID_RANGES.items():
                val = row.get(field_name)
                if val is not None:
                    range_checks += 1
                    try:
                        if lo <= float(val) <= hi:
                            range_passes += 1
                    except (TypeError, ValueError):
                        pass
        range_score = (range_passes / range_checks) if range_checks else 1.0

        score = round((0.60 * completeness + 0.40 * range_score) * 100, 2)
        logger.info(f"[cpcb] Quality: completeness={completeness:.2%}, range={range_score:.2%}, final={score}")
        return score

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _coerce(key: str, value: Any) -> Any:
        """Try to cast numeric fields to float; leave strings as-is."""
        numeric_fields = set(VALID_RANGES.keys()) | {
            "no", "nox", "nh3", "benzene", "toluene", "xylene",
            "solar_radiation", "barometric_pressure", "rainfall",
            "ambient_temp", "vector_wind_speed",
            "pollutant_min", "pollutant_max", "pollutant_avg",
            "latitude", "longitude",
        }
        if key in numeric_fields:
            try:
                return float(value)
            except (TypeError, ValueError):
                return None
        return value
