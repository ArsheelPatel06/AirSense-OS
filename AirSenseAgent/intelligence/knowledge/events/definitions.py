"""
Environmental Knowledge Base — Event Definitions.

Structured knowledge about environmental events that cause pollution spikes.
Each event stores indicators, likely pollutants, expected duration, mitigation,
and confidence signals to help the Causal Reasoning Engine.
"""
from __future__ import annotations
from dataclasses import dataclass, field


@dataclass
class EventKnowledge:
    name: str
    description: str
    indicators: dict[str, str]          # feature → expected signal
    primary_pollutants: list[str]       # pollutant keys
    typical_duration_hours: tuple[int, int]   # (min, max)
    affected_regions: list[str]
    seasonal_months: list[int]          # 1=Jan … 12=Dec
    mitigation: list[str]
    confidence_boost_features: list[str]  # features that strongly confirm this event


EVENT_KNOWLEDGE: dict[str, EventKnowledge] = {
    "crop_burning": EventKnowledge(
        name="Crop Burning",
        description="Stubble burning after harvest season, primarily in Punjab, Haryana, UP.",
        indicators={
            "pm25": "high (>150 µg/m³)",
            "pm10": "elevated",
            "wind_direction": "northwest (270–320°)",
            "wind_speed": "moderate (2–6 m/s)",
            "humidity": "moderate–high",
        },
        primary_pollutants=["pm25", "pm10", "co", "nh3"],
        typical_duration_hours=(72, 720),  # days to weeks
        affected_regions=["Delhi", "Haryana", "Punjab", "UP", "Chandigarh"],
        seasonal_months=[10, 11],          # Oct–Nov (Rabi) and Apr–May (Kharif)
        mitigation=[
            "Issue health advisories for NCR region",
            "Satellite fire count monitoring",
            "Consider traffic restrictions in impacted cities",
        ],
        confidence_boost_features=["wind_direction", "pm25", "co"],
    ),
    "dust_storm": EventKnowledge(
        name="Dust Storm",
        description="Andhi or haboob storms carrying desert dust from Thar Desert.",
        indicators={
            "pm10": "very high (>500 µg/m³)",
            "pm25": "elevated",
            "wind_speed": "high (>8 m/s)",
            "wind_direction": "west/northwest",
            "humidity": "low (<30%)",
            "visibility": "very low (<1 km)",
        },
        primary_pollutants=["pm10", "pm25"],
        typical_duration_hours=(2, 24),
        affected_regions=["Rajasthan", "Delhi", "Haryana", "UP", "Gujarat"],
        seasonal_months=[4, 5, 6],         # Apr–Jun pre-monsoon
        mitigation=[
            "Issue dust storm warning 2–4h in advance",
            "Close outdoor venues",
            "Advise citizens to stay indoors",
            "Postpone construction activities",
        ],
        confidence_boost_features=["pm10", "wind_speed", "humidity"],
    ),
    "festival": EventKnowledge(
        name="Festival Fireworks",
        description="PM2.5 and PM10 spike from fireworks during Diwali and other celebrations.",
        indicators={
            "pm25": "very high (>300 µg/m³)",
            "pm10": "very high",
            "so2": "elevated (fireworks contain sulfur)",
            "wind_speed": "low (<3 m/s worst case)",
        },
        primary_pollutants=["pm25", "pm10", "so2"],
        typical_duration_hours=(6, 48),
        affected_regions=["All urban centres"],
        seasonal_months=[10, 11],          # Diwali season; also New Year
        mitigation=[
            "Pre-event health advisory to vulnerable groups",
            "Mask distribution centres",
            "Hospital respiratory ward preparedness",
        ],
        confidence_boost_features=["pm25", "so2"],
    ),
    "temperature_inversion": EventKnowledge(
        name="Temperature Inversion",
        description="Cold air traps warm polluted air near surface, preventing dispersion. Classic winter smog driver.",
        indicators={
            "temperature": "low at ground (<15°C in winter)",
            "humidity": "high (>70%)",
            "wind_speed": "very low (<2 m/s)",
            "pm25": "rising despite no new sources",
            "pressure": "high (>1020 hPa)",
        },
        primary_pollutants=["pm25", "pm10", "no2"],
        typical_duration_hours=(12, 96),
        affected_regions=["Delhi", "Punjab", "UP", "Haryana", "Bihar"],
        seasonal_months=[11, 12, 1, 2],    # Nov–Feb
        mitigation=[
            "Restrict construction and open burning",
            "Issue morning/evening outdoor advisory",
            "Await meteorological improvement (wind or rain)",
        ],
        confidence_boost_features=["wind_speed", "humidity", "pressure"],
    ),
    "industrial_accident": EventKnowledge(
        name="Industrial Accident",
        description="Chemical release or fire at a factory or refinery causing acute local pollution.",
        indicators={
            "so2": "spike (refinery/chemical fire)",
            "co": "spike",
            "no2": "elevated",
            "wind_direction": "from industrial zone",
        },
        primary_pollutants=["so2", "co", "no2", "pm25"],
        typical_duration_hours=(1, 24),
        affected_regions=["Near industrial clusters"],
        seasonal_months=list(range(1, 13)),  # Any time
        mitigation=[
            "Immediate downwind evacuation advisory",
            "Coordinate with local emergency services",
            "Monitor affected station continuously",
        ],
        confidence_boost_features=["so2", "co", "wind_direction"],
    ),
    "vehicle_congestion": EventKnowledge(
        name="Traffic Rush Hour",
        description="Elevated NO2 and PM2.5 from peak vehicle congestion.",
        indicators={
            "no2": "high (>100 µg/m³)",
            "co": "elevated",
            "pm25": "moderately elevated",
            "hour": "07:00–10:00 or 17:00–20:00",
        },
        primary_pollutants=["no2", "co", "pm25"],
        typical_duration_hours=(2, 4),
        affected_regions=["All urban centres near major roads"],
        seasonal_months=list(range(1, 13)),
        mitigation=[
            "Encourage carpooling or public transport",
            "Recommend odd-even vehicle restrictions during high AQI periods",
        ],
        confidence_boost_features=["no2", "co"],
    ),
}
