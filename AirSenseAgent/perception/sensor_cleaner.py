"""Recovers missing values using simple interpolation or defaults."""
from typing import Dict, Any, List
from .schemas import PerceptionReport

class SensorCleaner:
    def __init__(self, fallback_defaults: Dict[str, float] = None):
        self.fallback = fallback_defaults or {
            "pm25": 15.0,
            "temperature": 22.0,
            "humidity": 50.0
        }

    def clean(self, sensors: Dict[str, float], required_fields: List[str], report: PerceptionReport) -> Dict[str, float]:
        """Imputes missing required fields so models don't crash."""
        cleaned = dict(sensors)
        for field in required_fields:
            if field not in cleaned or cleaned[field] is None:
                cleaned[field] = self.fallback.get(field, 0.0)
                report.imputed_fields.append(field)
                report.warnings.append(f"Imputed missing '{field}' with fallback {cleaned[field]}.")
        return cleaned
