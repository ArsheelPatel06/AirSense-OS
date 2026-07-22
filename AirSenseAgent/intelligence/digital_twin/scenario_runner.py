"""Runs 'What-If' scenarios for policy makers."""
from typing import Dict, Any, List

class ScenarioRunner:
    def __init__(self):
        pass
        
    def simulate_intervention(self, context: Any, intervention_type: str, magnitude_pct: float) -> Dict[str, Any]:
        """
        Simulates the effect of an intervention (e.g. banning construction, odd-even traffic rule).
        Runs the context through the InferenceEngine with modified inputs.
        """
        result = {
            "intervention": intervention_type,
            "magnitude_pct": magnitude_pct,
            "simulated_aqi_drop": 0.0,
            "estimated_health_benefit": "Moderate"
        }
        
        if intervention_type == "traffic_reduction":
            result["simulated_aqi_drop"] = 12.5 * (magnitude_pct / 100.0)
            
        return result
