"""
IND-AQI Calculator.

Source: CPCB Technical Report — "Measurement of CAQI and AQI for Indian Conditions"
        (FINAL-REPORT_AQI_.pdf, knowledge/standards/)

Algorithm (verbatim from report):

1. Compute the sub-index (Ip) for each pollutant p using the segmented
   linear function:

        Ip = ((IHi - ILo) / (CHi - CLo)) * (Cp - CLo) + ILo

   where:
        Cp   = measured pollutant concentration
        CLo  = concentration breakpoint ≤ Cp
        CHi  = concentration breakpoint ≥ Cp
        ILo  = AQI breakpoint corresponding to CLo
        IHi  = AQI breakpoint corresponding to CHi

2. Overall AQI = max(all computed sub-indices)
   This is the "maximum operator" rule to avoid eclipsing and ambiguity.
   The PROMINENT POLLUTANT is the one whose sub-index equals the overall AQI.

3. AQI is only calculated when at least ONE pollutant has a valid reading.
   For calculation, at least PM2.5 or PM10 should be available (CPCB guidance).
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional

from intelligence.feature_builder.aqi.breakpoints import BREAKPOINTS
from intelligence.feature_builder.aqi.categories import AQICategory, get_category


@dataclass
class SubIndex:
    """Result of the segmented linear function for one pollutant."""
    pollutant: str
    concentration: float
    sub_index: int
    breakpoint_lo: tuple[float, int]  # (C_lo, I_lo)
    breakpoint_hi: tuple[float, int]  # (C_hi, I_hi)


@dataclass
class AQIResult:
    """Full output of the IND-AQI calculator for a single observation set."""
    aqi: int
    prominent_pollutant: str
    category: Optional[AQICategory]
    sub_indices: dict[str, int]          # { pollutant: sub_index }
    concentrations: dict[str, float]     # { pollutant: concentration }
    missing_pollutants: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)


class AQICalculator:
    """
    Standalone IND-AQI calculator.

    This class has NO knowledge of connectors, providers, or the data lake.
    It is a pure computation engine.

    Usage:
        calc = AQICalculator()
        result = calc.calculate({
            "PM2.5": 67.0,
            "PM10": 120.0,
            "NO2": 45.0,
        })
        print(result.aqi)              # e.g. 142
        print(result.prominent_pollutant)  # e.g. "PM10"
        print(result.category.name)    # e.g. "Moderately Polluted"
    """

    def calculate(self, concentrations: dict[str, float]) -> AQIResult:
        """
        Compute IND-AQI from a dict of pollutant concentrations.

        Args:
            concentrations: e.g. {"PM2.5": 67.0, "PM10": 120.0, "NO2": 45.0}
                            Units must match averaging periods in breakpoints.py.

        Returns:
            AQIResult with overall AQI, prominent pollutant, category,
            and all sub-indices.

        Raises:
            ValueError: If no valid pollutant concentrations are provided.
        """
        sub_indices: dict[str, int] = {}
        missing: list[str] = []
        warnings: list[str] = []

        for pollutant, concentration in concentrations.items():
            if pollutant not in BREAKPOINTS:
                warnings.append(f"Unknown pollutant '{pollutant}' — skipped.")
                continue
            if concentration is None or concentration < 0:
                missing.append(pollutant)
                continue

            si = self._sub_index(pollutant, concentration)
            if si is not None:
                sub_indices[pollutant] = si.sub_index
            else:
                warnings.append(
                    f"Concentration {concentration} for '{pollutant}' is out of range — skipped."
                )
                missing.append(pollutant)

        if not sub_indices:
            raise ValueError(
                "Cannot compute AQI: no valid pollutant concentrations provided. "
                f"Attempted pollutants: {list(concentrations.keys())}"
            )

        # Maximum operator rule (CPCB): overall AQI = highest sub-index
        prominent_pollutant = max(sub_indices, key=lambda p: sub_indices[p])
        overall_aqi = sub_indices[prominent_pollutant]
        category = get_category(overall_aqi)

        return AQIResult(
            aqi=overall_aqi,
            prominent_pollutant=prominent_pollutant,
            category=category,
            sub_indices=sub_indices,
            concentrations={k: v for k, v in concentrations.items() if k in sub_indices},
            missing_pollutants=missing,
            warnings=warnings,
        )

    def _sub_index(self, pollutant: str, concentration: float) -> SubIndex | None:
        """
        Apply the segmented linear function to compute a pollutant sub-index.

        Returns None if concentration is outside all defined breakpoints.
        """
        for (c_lo, c_hi, i_lo, i_hi) in BREAKPOINTS[pollutant]:
            if c_lo <= concentration <= c_hi:
                # Segmented linear interpolation (CPCB formula)
                ip = ((i_hi - i_lo) / (c_hi - c_lo)) * (concentration - c_lo) + i_lo
                return SubIndex(
                    pollutant=pollutant,
                    concentration=concentration,
                    sub_index=round(ip),
                    breakpoint_lo=(c_lo, i_lo),
                    breakpoint_hi=(c_hi, i_hi),
                )
        return None
