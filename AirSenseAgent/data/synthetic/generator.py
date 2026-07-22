"""Procedurally generates edge-case datasets for pipeline testing."""
import json
from typing import Dict, Any, List

class SyntheticGenerator:
    def __init__(self):
        pass
        
    def generate_pollution_spike(self, output_path: str):
        """Generates a scenario where PM2.5 spikes due to localized traffic."""
        scenario = {
            "scenario": "pollution_spike",
            "sensors": [
                {"station_id": "S1", "pm25": 180, "pm10": 210, "no2": 75}
            ],
            "weather": [
                {"wind_speed": 2.0, "temperature": 32, "humidity": 80}
            ],
            "satellite": [
                {"aerosol_index": 1.2, "no2_column_density": 0.0004}
            ],
            "citizen_reports": [
                {"type": "traffic_jam", "count": 8, "confidence": 0.9}
            ]
        }
        with open(output_path, "w") as f:
            json.dump(scenario, f, indent=2)
