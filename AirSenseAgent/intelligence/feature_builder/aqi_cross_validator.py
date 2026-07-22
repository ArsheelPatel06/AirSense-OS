"""
AQI Cross-Validation.

Every live CPCB observation is cross-validated:

    CPCB API → Pollutants → AQI Engine → Calculated AQI
                                               ↕  delta
                         Official AQI ←  CPCB bulletin

If |calculated_aqi - official_aqi| <= TOLERANCE → mark VERIFIED
Else → generate validation warning

This is an excellent regression test for the AQI engine.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Optional

from intelligence.feature_builder.aqi import AQICalculator

logger = logging.getLogger(__name__)

# CPCB field names → AQI Engine pollutant names
_POLLUTANT_MAP = {
    "pm25": "PM2.5",
    "pm10": "PM10",
    "no2":  "NO2",
    "so2":  "SO2",
    "co":   "CO",
    "o3":   "O3",
    "nh3":  "NH3",
}

# Acceptable difference between calculated and official AQI (CPCB tolerance)
DEFAULT_TOLERANCE = 5


@dataclass
class AQIValidationResult:
    """Result of a single AQI cross-validation."""
    station_id: str
    timestamp: str
    calculated_aqi: int
    official_aqi: Optional[int]
    delta: Optional[int]
    verified: bool
    prominent_pollutant: str
    warnings: list[str] = field(default_factory=list)


class AQICrossValidator:
    """
    Validates CPCB live observations against the AQI Engine.

    Usage:
        validator = AQICrossValidator(tolerance=5)
        result = validator.validate(feature_vector)
    """

    def __init__(self, tolerance: int = DEFAULT_TOLERANCE):
        self._tolerance = tolerance
        self._calculator = AQICalculator()

    def validate(self, record: dict,
                 official_aqi: Optional[int] = None) -> AQIValidationResult:
        """
        Compute AQI from a normalized record and compare to official value.

        Args:
            record       : Normalized CPCB record (keys are canonical field names)
            official_aqi : AQI value from official bulletin (if available)

        Returns:
            AQIValidationResult
        """
        warnings: list[str] = []

        # Build concentrations dict for AQI Engine
        concentrations: dict[str, float] = {}
        for record_key, aqi_key in _POLLUTANT_MAP.items():
            val = record.get(record_key) or record.get(aqi_key)
            if val is not None:
                try:
                    concentrations[aqi_key] = float(val)
                except (TypeError, ValueError):
                    pass

        if not concentrations:
            warnings.append("No valid pollutant concentrations found — AQI cannot be calculated.")
            return AQIValidationResult(
                station_id=str(record.get("station_id", "")),
                timestamp=str(record.get("timestamp", "")),
                calculated_aqi=0,
                official_aqi=official_aqi,
                delta=None,
                verified=False,
                prominent_pollutant="",
                warnings=warnings,
            )

        # Calculate AQI using the official CPCB engine
        try:
            aqi_result = self._calculator.calculate(concentrations)
        except ValueError as exc:
            warnings.append(str(exc))
            return AQIValidationResult(
                station_id=str(record.get("station_id", "")),
                timestamp=str(record.get("timestamp", "")),
                calculated_aqi=0,
                official_aqi=official_aqi,
                delta=None,
                verified=False,
                prominent_pollutant="",
                warnings=warnings,
            )

        calculated = aqi_result.aqi
        delta = None
        verified = False

        if official_aqi is not None:
            delta = abs(calculated - official_aqi)
            verified = delta <= self._tolerance
            if not verified:
                warnings.append(
                    f"AQI mismatch: calculated={calculated}, "
                    f"official={official_aqi}, delta={delta} "
                    f"(tolerance={self._tolerance})"
                )
                logger.warning(
                    f"[AQICrossValidator] Station {record.get('station_id', '?')} — "
                    f"delta={delta} exceeds tolerance={self._tolerance}"
                )
            else:
                logger.debug(
                    f"[AQICrossValidator] Station {record.get('station_id', '?')} — "
                    f"VERIFIED (delta={delta})"
                )

        return AQIValidationResult(
            station_id=str(record.get("station_id", "")),
            timestamp=str(record.get("timestamp", "")),
            calculated_aqi=calculated,
            official_aqi=official_aqi,
            delta=delta,
            verified=verified,
            prominent_pollutant=aqi_result.prominent_pollutant,
            warnings=warnings + aqi_result.warnings,
        )

    def validate_batch(self, records: list[dict],
                       official_aqi_map: dict[str, int] | None = None) -> list[AQIValidationResult]:
        """
        Validate a batch of records.

        Args:
            records         : List of normalized CPCB records.
            official_aqi_map: Optional dict mapping station_id → official AQI.
        """
        official_aqi_map = official_aqi_map or {}
        results = []
        for rec in records:
            sid = str(rec.get("station_id", ""))
            official = official_aqi_map.get(sid)
            results.append(self.validate(rec, official_aqi=official))
        return results
