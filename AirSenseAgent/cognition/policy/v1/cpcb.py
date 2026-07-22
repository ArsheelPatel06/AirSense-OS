"""Central Pollution Control Board (India) Guidelines."""
from typing import Dict, Any

class CPCBRules:
    @staticmethod
    def get_interventions(aqi: float) -> list:
        if aqi > 400:
            return ["Halt Construction", "Restrict Heavy Vehicles"]
        return []
