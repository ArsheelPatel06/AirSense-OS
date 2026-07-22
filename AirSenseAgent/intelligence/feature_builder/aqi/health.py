"""
AQI Health Advisory Generator.

Translates an AQIResult into structured health advisories for
different sensitive groups, following CPCB health impact guidelines.
"""
from __future__ import annotations

from dataclasses import dataclass, field

from intelligence.feature_builder.aqi.calculator import AQIResult
from intelligence.feature_builder.aqi.categories import get_category


@dataclass
class HealthAdvisory:
    """Structured health advisory for a specific group."""
    group: str
    recommendation: str
    risk_level: str  # low / moderate / high / very_high / severe


@dataclass
class HealthReport:
    aqi: int
    category: str
    color: str
    general_statement: str
    advisories: list[HealthAdvisory] = field(default_factory=list)
    prominent_pollutant: str = ""
    prominent_sub_index: int = 0


# Advisory templates keyed by category name
_ADVISORIES: dict[str, list[dict]] = {
    "Good": [
        {"group": "General Population",  "recommendation": "No precautions required. Enjoy outdoor activities.", "risk_level": "low"},
        {"group": "Sensitive Groups",    "recommendation": "No special precautions needed.", "risk_level": "low"},
        {"group": "Children",            "recommendation": "Safe for outdoor play.", "risk_level": "low"},
        {"group": "Elderly",             "recommendation": "No restrictions.", "risk_level": "low"},
        {"group": "Heart/Lung Patients", "recommendation": "Continue normal activities.", "risk_level": "low"},
    ],
    "Satisfactory": [
        {"group": "General Population",  "recommendation": "Air quality is acceptable.", "risk_level": "low"},
        {"group": "Sensitive Groups",    "recommendation": "Consider reducing prolonged outdoor exertion.", "risk_level": "moderate"},
        {"group": "Children",            "recommendation": "Outdoor play is generally safe.", "risk_level": "low"},
        {"group": "Elderly",             "recommendation": "Monitor for any unusual symptoms.", "risk_level": "low"},
        {"group": "Heart/Lung Patients", "recommendation": "Minor breathing discomfort possible.", "risk_level": "moderate"},
    ],
    "Moderately Polluted": [
        {"group": "General Population",  "recommendation": "Reduce prolonged outdoor exertion.", "risk_level": "moderate"},
        {"group": "Sensitive Groups",    "recommendation": "Limit outdoor activity. Keep medication handy.", "risk_level": "high"},
        {"group": "Children",            "recommendation": "Limit extended outdoor play.", "risk_level": "moderate"},
        {"group": "Elderly",             "recommendation": "Reduce time spent outdoors.", "risk_level": "high"},
        {"group": "Heart/Lung Patients", "recommendation": "Avoid strenuous outdoor activity.", "risk_level": "high"},
    ],
    "Poor": [
        {"group": "General Population",  "recommendation": "Everyone should limit prolonged outdoor exertion.", "risk_level": "high"},
        {"group": "Sensitive Groups",    "recommendation": "Avoid outdoor activity entirely.", "risk_level": "very_high"},
        {"group": "Children",            "recommendation": "Keep children indoors.", "risk_level": "very_high"},
        {"group": "Elderly",             "recommendation": "Stay indoors. Close windows.", "risk_level": "very_high"},
        {"group": "Heart/Lung Patients", "recommendation": "Remain indoors. Seek medical advice if symptoms worsen.", "risk_level": "very_high"},
    ],
    "Very Poor": [
        {"group": "General Population",  "recommendation": "Avoid all outdoor exertion.", "risk_level": "very_high"},
        {"group": "Sensitive Groups",    "recommendation": "Stay indoors. Use air purifiers.", "risk_level": "severe"},
        {"group": "Children",            "recommendation": "No outdoor activity. Wear N95 if going outside.", "risk_level": "severe"},
        {"group": "Elderly",             "recommendation": "Do not venture outdoors.", "risk_level": "severe"},
        {"group": "Heart/Lung Patients", "recommendation": "Medical emergency risk. Follow physician advice.", "risk_level": "severe"},
    ],
    "Severe": [
        {"group": "General Population",  "recommendation": "Stay indoors. Avoid all outdoor activity.", "risk_level": "severe"},
        {"group": "Sensitive Groups",    "recommendation": "Health emergency. Do not go outside.", "risk_level": "severe"},
        {"group": "Children",            "recommendation": "Schools should consider closing or going online.", "risk_level": "severe"},
        {"group": "Elderly",             "recommendation": "Extreme health risk. Stay indoors at all times.", "risk_level": "severe"},
        {"group": "Heart/Lung Patients", "recommendation": "Immediate medical risk. Seal home, use purifiers.", "risk_level": "severe"},
    ],
}


class HealthAdvisoryGenerator:
    """
    Generates structured health advisories from an AQIResult.

    Completely independent from connectors and providers.
    """

    def generate(self, result: AQIResult) -> HealthReport:
        """Generate a full health report for a given AQIResult."""
        category = get_category(result.aqi)
        if not category:
            cat_name = "Unknown"
            color = "#888888"
            general = "AQI out of range. Data may be invalid."
            raw_advisories = []
        else:
            cat_name = category.name
            color = category.color_hex
            general = category.health_impact
            raw_advisories = _ADVISORIES.get(cat_name, [])

        advisories = [HealthAdvisory(**a) for a in raw_advisories]

        return HealthReport(
            aqi=result.aqi,
            category=cat_name,
            color=color,
            general_statement=general,
            advisories=advisories,
            prominent_pollutant=result.prominent_pollutant,
            prominent_sub_index=result.sub_indices.get(result.prominent_pollutant, 0),
        )
