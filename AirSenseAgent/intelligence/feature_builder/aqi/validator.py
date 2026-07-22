"""
AQI Validator.

Validates AQIResult objects against CPCB compliance rules before
they are written to the Feature Store or displayed on the dashboard.
"""
from __future__ import annotations

from dataclasses import dataclass, field

from intelligence.feature_builder.aqi.calculator import AQIResult


@dataclass
class ValidationReport:
    is_valid: bool
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)


class AQIValidator:
    """
    Validates an AQIResult for CPCB compliance.

    Rules enforced:
      1. AQI must be in [0, 500].
      2. At least PM2.5 or PM10 must have a valid sub-index (CPCB guidance).
      3. Prominent pollutant must be present in sub_indices.
      4. All sub-indices must be in [0, 500].
    """

    MINIMUM_POLLUTANTS = {"PM2.5", "PM10"}

    def validate(self, result: AQIResult) -> ValidationReport:
        errors: list[str] = []
        warnings: list[str] = list(result.warnings)

        # Rule 1: AQI bounds
        if not (0 <= result.aqi <= 500):
            errors.append(f"AQI {result.aqi} is outside the valid range [0, 500].")

        # Rule 2: Minimum required pollutants
        available = set(result.sub_indices.keys())
        if not available.intersection(self.MINIMUM_POLLUTANTS):
            errors.append(
                "CPCB requires at least PM2.5 or PM10 for a valid AQI calculation."
            )

        # Rule 3: Prominent pollutant consistency
        if result.prominent_pollutant not in result.sub_indices:
            errors.append(
                f"Prominent pollutant '{result.prominent_pollutant}' not found in sub_indices."
            )

        # Rule 4: Individual sub-index bounds
        for pollutant, si in result.sub_indices.items():
            if not (0 <= si <= 500):
                errors.append(f"Sub-index for '{pollutant}' is {si}, outside [0, 500].")

        # Warnings for missing pollutants
        for p in result.missing_pollutants:
            warnings.append(f"Pollutant '{p}' was missing — sub-index not computed.")

        return ValidationReport(
            is_valid=len(errors) == 0,
            errors=errors,
            warnings=warnings,
        )
