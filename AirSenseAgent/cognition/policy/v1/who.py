"""World Health Organization Guidelines."""
from typing import Dict, Any

class WHORules:
    @staticmethod
    def get_health_advisory(pm25: float) -> str:
        if pm25 > 25.0:
            return "Exceeds 24h mean guideline. Sensitive groups should reduce exertion."
        return "Within safe limits."
