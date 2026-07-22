"""Detects statistical outliers (e.g., impossible spikes)."""
from typing import Dict, Any
from .schemas import PerceptionReport

class OutlierDetector:
    def __init__(self, spike_threshold: float = 100.0):
        self.spike_threshold = spike_threshold
        
    def detect_and_cap(self, sensors: Dict[str, float], last_sensors: Dict[str, float], report: PerceptionReport) -> Dict[str, float]:
        """Caps values that jump impossibly fast between cycles."""
        if not last_sensors:
            return sensors
            
        capped = dict(sensors)
        for field, value in sensors.items():
            if field in last_sensors:
                delta = value - last_sensors[field]
                if abs(delta) > self.spike_threshold:
                    # Cap the movement
                    capped[field] = last_sensors[field] + (self.spike_threshold if delta > 0 else -self.spike_threshold)
                    report.warnings.append(f"Outlier capped on '{field}': jump of {delta} exceeded threshold.")
        return capped
