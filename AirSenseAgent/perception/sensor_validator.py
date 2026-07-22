"""Validates raw sensor data against physical bounds and rules."""
from typing import Dict, Any, Tuple
from config.ai_config import (
    PM25_VALID_RANGE, PM10_VALID_RANGE, 
    TEMPERATURE_VALID_RANGE, HUMIDITY_VALID_RANGE
)
from .schemas import PerceptionReport

class SensorValidator:
    def __init__(self):
        self.ranges = {
            "pm25": PM25_VALID_RANGE,
            "pm10": PM10_VALID_RANGE,
            "temperature": TEMPERATURE_VALID_RANGE,
            "humidity": HUMIDITY_VALID_RANGE
        }

    def validate(self, raw_sensors: Dict[str, float], report: PerceptionReport) -> Dict[str, float]:
        """
        Removes invalid readings that violate physical constraints.
        E.g., Negative PM2.5 or > 100% Humidity.
        """
        validated = {}
        for sensor, value in raw_sensors.items():
            if sensor in self.ranges:
                min_val, max_val = self.ranges[sensor]
                if min_val <= value <= max_val:
                    validated[sensor] = value
                else:
                    report.warnings.append(f"Sensor '{sensor}' value {value} out of physical bounds {self.ranges[sensor]}. Dropped.")
            else:
                # Unrestricted sensor
                validated[sensor] = value
                
        return validated
