"""Initializes the objective for the current operational cycle."""
from typing import Dict, Any, List

class GoalManager:
    def __init__(self):
        pass
        
    def determine_goal(self, prediction_bundle: Any, current_state: Any) -> str:
        """
        Determines the primary objective based on the latest predictions.
        E.g. Protect Schools, Minimize Cost, Emergency Evacuation, Routine Monitoring.
        """
        aqi = prediction_bundle.predictions.get("pm25", 0.0)
        
        if aqi > 300:
            return "Protect Population"
        elif aqi > 150:
            return "Reduce AQI"
        else:
            return "Routine Monitoring"
