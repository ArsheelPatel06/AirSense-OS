"""
Policy Engine — CPCB Rules.

Official Indian National Ambient Air Quality Standards (NAAQS) and
AQI categories as defined by the Central Pollution Control Board.

Reference: CPCB AQI Bulletin methodology and notification.
Updating this file reflects new CPCB standards without model retraining.
"""
from __future__ import annotations
from dataclasses import dataclass


@dataclass
class AQICategory:
    name: str
    aqi_min: int
    aqi_max: int
    color: str
    health_implications: str
    citizen_advisory: str
    government_action: str


# ── CPCB AQI Categories ───────────────────────────────────────────────────────
CPCB_AQI_CATEGORIES: list[AQICategory] = [
    AQICategory(
        name="Good",
        aqi_min=0, aqi_max=50,
        color="green",
        health_implications="Minimal impact.",
        citizen_advisory="No restrictions. Air quality is satisfactory.",
        government_action="No action required.",
    ),
    AQICategory(
        name="Satisfactory",
        aqi_min=51, aqi_max=100,
        color="light_green",
        health_implications="Minor breathing discomfort to sensitive people.",
        citizen_advisory="Sensitive individuals (asthma, heart conditions) should reduce prolonged outdoor exertion.",
        government_action="Continue routine monitoring.",
    ),
    AQICategory(
        name="Moderate",
        aqi_min=101, aqi_max=200,
        color="yellow",
        health_implications="Breathing discomfort to people with lung disease, elderly, and children.",
        citizen_advisory="Sensitive groups should avoid prolonged outdoor exertion. Consider N95 mask.",
        government_action="Issue advisory for sensitive populations. Review emission sources.",
    ),
    AQICategory(
        name="Poor",
        aqi_min=201, aqi_max=300,
        color="orange",
        health_implications="Breathing discomfort to most people on prolonged exposure.",
        citizen_advisory="Wear N95 mask outdoors. Avoid outdoor exercise. Keep windows closed.",
        government_action="Trigger Graded Response Action Plan (GRAP) Stage I restrictions.",
    ),
    AQICategory(
        name="Very Poor",
        aqi_min=301, aqi_max=400,
        color="red",
        health_implications="Respiratory illness on prolonged exposure. Affects healthy individuals too.",
        citizen_advisory="Avoid outdoor activities. N95 mandatory if outdoors. Consider HEPA purifier indoors.",
        government_action=(
            "Trigger GRAP Stage II. Consider school closures. Restrict construction and "
            "industrial burning. Implement odd-even vehicle scheme."
        ),
    ),
    AQICategory(
        name="Severe",
        aqi_min=401, aqi_max=500,
        color="maroon",
        health_implications="Serious risk to all. Even healthy individuals are affected.",
        citizen_advisory=(
            "Stay indoors with air purifier. N95 is mandatory for any outdoor exposure. "
            "Hospitals should prepare for respiratory surge."
        ),
        government_action=(
            "Trigger GRAP Stage III/IV. Emergency school and college closures. "
            "Halt all construction. Halt diesel generator use. "
            "Consider partial industrial shutdown. Coordinate health emergency response."
        ),
    ),
]


def classify_aqi(aqi: int) -> AQICategory:
    """Return the CPCB AQI category for a given AQI value."""
    for category in CPCB_AQI_CATEGORIES:
        if category.aqi_min <= aqi <= category.aqi_max:
            return category
    # Out of range (>500 — rare but possible during severe events)
    return AQICategory(
        name="Hazardous (Beyond Scale)",
        aqi_min=501, aqi_max=9999,
        color="black",
        health_implications="Extremely hazardous. Health emergency conditions.",
        citizen_advisory="Do NOT go outdoors under any circumstances.",
        government_action="Declare air quality emergency. All restrictions in force.",
    )


# ── CPCB Station Compliance Thresholds ───────────────────────────────────────
# NAAQS annual mean standards (µg/m³)
NAAQS_ANNUAL = {
    "pm25": 40.0,
    "pm10": 60.0,
    "no2":  40.0,
    "so2":  50.0,
    "co":   2.0,    # mg/m³
    "o3":   100.0,  # 8h average
    "nh3":  100.0,
}

# NAAQS 24-hour standards (µg/m³)
NAAQS_24H = {
    "pm25": 60.0,
    "pm10": 100.0,
    "no2":  80.0,
    "so2":  80.0,
    "co":   4.0,
    "o3":   180.0,
}
