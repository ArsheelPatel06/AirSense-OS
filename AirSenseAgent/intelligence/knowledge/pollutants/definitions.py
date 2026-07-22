"""
Environmental Knowledge Base — Pollutant Definitions.

Curated domain knowledge about each pollutant tracked by AirSense.
The Reasoning Engine consults this alongside ML predictions.
Updating this file (e.g., new WHO guidance) does NOT require model retraining.
"""
from __future__ import annotations
from dataclasses import dataclass, field


@dataclass
class PollutantKnowledge:
    name: str
    full_name: str
    units: str
    sources: list[str]
    health_effects: list[str]
    vulnerable_groups: list[str]
    mitigation: list[str]
    who_annual_guideline_ugm3: float | None = None   # µg/m³
    who_daily_guideline_ugm3: float | None = None
    notes: str = ""


POLLUTANT_KNOWLEDGE: dict[str, PollutantKnowledge] = {
    "pm25": PollutantKnowledge(
        name="PM2.5",
        full_name="Particulate Matter (≤2.5 µm)",
        units="µg/m³",
        sources=[
            "Vehicle exhaust",
            "Crop burning",
            "Industrial emissions",
            "Construction dust",
            "Biomass burning",
            "Secondary formation (SO2 + NOx reactions)",
        ],
        health_effects=[
            "Aggravates asthma and COPD",
            "Cardiovascular disease (long-term)",
            "Reduced lung function",
            "Premature death at high concentrations",
            "Neurological impacts (emerging evidence)",
        ],
        vulnerable_groups=["Children", "Elderly", "Pregnant women", "Asthmatics", "Heart disease patients"],
        mitigation=[
            "Wear N95/P2 respirator mask",
            "Stay indoors with windows closed",
            "Use HEPA air purifier indoors",
            "Avoid outdoor exercise",
            "Monitor AQI before going out",
        ],
        who_annual_guideline_ugm3=5.0,
        who_daily_guideline_ugm3=15.0,
    ),
    "pm10": PollutantKnowledge(
        name="PM10",
        full_name="Particulate Matter (≤10 µm)",
        units="µg/m³",
        sources=[
            "Road dust",
            "Construction sites",
            "Vehicle exhaust",
            "Dust storms",
            "Agricultural operations",
        ],
        health_effects=[
            "Respiratory irritation",
            "Aggravates asthma",
            "Reduced lung function",
            "Eye and throat irritation",
        ],
        vulnerable_groups=["Children", "Elderly", "Asthmatics"],
        mitigation=[
            "Use surgical mask or N95",
            "Limit outdoor exposure during dusty conditions",
            "Rinse nasal passages after outdoor exposure",
        ],
        who_annual_guideline_ugm3=15.0,
        who_daily_guideline_ugm3=45.0,
    ),
    "no2": PollutantKnowledge(
        name="NO₂",
        full_name="Nitrogen Dioxide",
        units="µg/m³",
        sources=[
            "Vehicle exhaust (primary source in cities)",
            "Power plants",
            "Industrial combustion",
        ],
        health_effects=[
            "Respiratory inflammation",
            "Aggravates asthma",
            "Increased susceptibility to respiratory infections",
            "Contributes to PM2.5 and ozone formation (secondary)",
        ],
        vulnerable_groups=["Children", "Asthmatics", "People near roads"],
        mitigation=[
            "Avoid peak traffic hours",
            "Use public transport or electric vehicles",
            "Keep windows closed near busy roads",
        ],
        who_annual_guideline_ugm3=10.0,
        who_daily_guideline_ugm3=25.0,
    ),
    "so2": PollutantKnowledge(
        name="SO₂",
        full_name="Sulphur Dioxide",
        units="µg/m³",
        sources=["Coal power plants", "Industrial smelters", "Diesel vehicles", "Ship emissions"],
        health_effects=[
            "Throat and airway irritation",
            "Bronchoconstriction in asthmatics",
            "Contributes to acid rain",
            "Forms PM2.5 through secondary reactions",
        ],
        vulnerable_groups=["Asthmatics", "People near industrial areas"],
        mitigation=[
            "Avoid areas near industrial sites",
            "Use N95 near industrial zones",
        ],
        who_daily_guideline_ugm3=40.0,
    ),
    "co": PollutantKnowledge(
        name="CO",
        full_name="Carbon Monoxide",
        units="mg/m³",
        sources=["Incomplete combustion: vehicles, generators, cooking fires", "Wildfires"],
        health_effects=[
            "Reduces blood oxygen-carrying capacity",
            "Headache and dizziness at moderate levels",
            "Unconsciousness and death at very high levels",
            "Cardiovascular stress (long-term low exposure)",
        ],
        vulnerable_groups=["Heart disease patients", "Foetuses", "People in enclosed spaces"],
        mitigation=[
            "Ensure good ventilation indoors",
            "Install CO detector",
            "Avoid using generators indoors",
        ],
    ),
    "o3": PollutantKnowledge(
        name="O₃",
        full_name="Ozone (Ground-level)",
        units="µg/m³",
        sources=[
            "Formed by NOx + VOC reactions in sunlight",
            "Not directly emitted — photochemical secondary pollutant",
        ],
        health_effects=[
            "Chest pain and coughing",
            "Aggravates asthma and emphysema",
            "Reduces lung function",
            "Long-term: increased risk of respiratory disease",
        ],
        vulnerable_groups=["Children", "Elderly", "Asthmatics", "Outdoor workers"],
        mitigation=[
            "Reduce outdoor activity on hot, sunny, low-wind days",
            "Avoid afternoon outdoor exercise (ozone peaks 12–18h)",
        ],
        who_daily_guideline_ugm3=100.0,
    ),
}
