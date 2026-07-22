"""
AQI Module Init.

Exposes the public API of the AQI engine.

    from intelligence.feature_builder.aqi import AQICalculator, AQIValidator, HealthAdvisoryGenerator

The AQI engine is completely independent from connectors, providers, and the lake.
"""
from intelligence.feature_builder.aqi.calculator import AQICalculator, AQIResult, SubIndex
from intelligence.feature_builder.aqi.categories import AQICategory, CATEGORIES, get_category
from intelligence.feature_builder.aqi.breakpoints import BREAKPOINTS, AVERAGING_PERIODS, POLLUTANTS
from intelligence.feature_builder.aqi.validator import AQIValidator, ValidationReport
from intelligence.feature_builder.aqi.health import HealthAdvisoryGenerator, HealthReport, HealthAdvisory

__all__ = [
    # Calculator
    "AQICalculator",
    "AQIResult",
    "SubIndex",
    # Categories
    "AQICategory",
    "CATEGORIES",
    "get_category",
    # Breakpoints
    "BREAKPOINTS",
    "AVERAGING_PERIODS",
    "POLLUTANTS",
    # Validator
    "AQIValidator",
    "ValidationReport",
    # Health
    "HealthAdvisoryGenerator",
    "HealthReport",
    "HealthAdvisory",
]
