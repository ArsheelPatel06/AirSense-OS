"""
AQI Categories and Health Impacts.

Source: CPCB Technical Report — "Measurement of CAQI and AQI for Indian Conditions"
        (FINAL-REPORT_AQI_.pdf, knowledge/standards/)

Defines the six AQI bands with:
    - AQI range
    - Colour code (hex)
    - Category name
    - Health impact statement
    - Cautionary statement

These are the official CPCB definitions, not approximations.
"""

from __future__ import annotations
from dataclasses import dataclass


@dataclass(frozen=True)
class AQICategory:
    name: str
    aqi_low: int
    aqi_high: int
    color_hex: str
    health_impact: str
    cautionary_statement: str


# ---------------------------------------------------------------------------
# Six official CPCB AQI categories (in ascending order of severity)
# ---------------------------------------------------------------------------

CATEGORIES: list[AQICategory] = [
    AQICategory(
        name="Good",
        aqi_low=0,
        aqi_high=50,
        color_hex="#00B050",
        health_impact="Minimal impact.",
        cautionary_statement="No precautions needed. Ideal for outdoor activities.",
    ),
    AQICategory(
        name="Satisfactory",
        aqi_low=51,
        aqi_high=100,
        color_hex="#92D050",
        health_impact=(
            "Minor breathing discomfort to sensitive people."
        ),
        cautionary_statement=(
            "Unusually sensitive individuals should consider reducing prolonged outdoor exertion."
        ),
    ),
    AQICategory(
        name="Moderately Polluted",
        aqi_low=101,
        aqi_high=200,
        color_hex="#FFFF00",
        health_impact=(
            "Breathing discomfort to the people with lung, heart disease, children and older adults."
        ),
        cautionary_statement=(
            "People with lung disease, children and older adults should limit prolonged outdoor exertion."
        ),
    ),
    AQICategory(
        name="Poor",
        aqi_low=201,
        aqi_high=300,
        color_hex="#FF7E00",
        health_impact=(
            "Breathing discomfort to most people on prolonged exposure."
        ),
        cautionary_statement=(
            "Everyone should limit prolonged outdoor exertion. "
            "People with disease should avoid outdoor activity."
        ),
    ),
    AQICategory(
        name="Very Poor",
        aqi_low=301,
        aqi_high=400,
        color_hex="#FF0000",
        health_impact=(
            "Respiratory illness on prolonged exposure. "
            "Affect healthy people and serious effects on sensitive ones."
        ),
        cautionary_statement=(
            "Everyone should avoid prolonged outdoor exertion. "
            "People with disease should remain indoors."
        ),
    ),
    AQICategory(
        name="Severe",
        aqi_low=401,
        aqi_high=500,
        color_hex="#7E0023",
        health_impact=(
            "Affects healthy people and seriously impacts those with lung/heart disease. "
            "Even light activity causes serious health effects."
        ),
        cautionary_statement=(
            "Everyone should avoid all outdoor exertion. "
            "People with disease should stay indoors and keep activity levels low."
        ),
    ),
]


def get_category(aqi: int) -> AQICategory | None:
    """Return the AQICategory for a given AQI value, or None if out of range."""
    for cat in CATEGORIES:
        if cat.aqi_low <= aqi <= cat.aqi_high:
            return cat
    return None
