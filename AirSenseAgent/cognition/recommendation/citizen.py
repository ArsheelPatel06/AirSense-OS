"""Generates personalized advisories for general citizens."""
from typing import Dict, Any

class CitizenRecommendationEngine:
    @staticmethod
    def generate(decision: Dict[str, Any], context: Any) -> Dict[str, Any]:
        return {
            "advisory_type": "Health & Safety",
            "message": "Wear an N95 mask and avoid outdoor running.",
            "route_suggestion": "Take the indoor metro instead of walking."
        }
