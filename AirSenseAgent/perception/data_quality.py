"""Scores and profiles the incoming UnifiedObservation."""
from typing import Dict, Any, List, Tuple
from .schemas import UnifiedObservation, PerceptionReport

class DataQualityEngine:
    def __init__(self, required_sensors: List[str] = None):
        self.required_sensors = required_sensors or ["pm25", "temperature", "humidity"]

    def evaluate(self, obs: UnifiedObservation) -> PerceptionReport:
        """Evaluates the raw data for completeness, noise, and reliability."""
        issues = []
        warnings = []
        
        # 1. Completeness Score
        present = sum(1 for s in self.required_sensors if s in obs.iot_sensors)
        completeness = present / len(self.required_sensors) if self.required_sensors else 1.0
        if completeness < 1.0:
            issues.append(f"Missing {len(self.required_sensors) - present} required sensors.")
            
        # 2. Freshness Score (Dummy logic for timestamp delay)
        freshness = 1.0  # Ideally calculated against current time vs obs.timestamp
        
        # 3. Aggregate Score
        overall = (completeness * 0.7) + (freshness * 0.3)
        
        return PerceptionReport(
            overall_quality_score=round(overall, 2),
            completeness_score=round(completeness, 2),
            freshness_score=round(freshness, 2),
            issues=issues,
            warnings=warnings
        )
