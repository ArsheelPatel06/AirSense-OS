"""Deterministic Rule execution (WHO, CPCB guidelines)."""
from typing import Dict, Any

class RulesEngine:
    def __init__(self):
        pass
        
    def evaluate(self, context: Any) -> Dict[str, Any]:
        """
        Applies hardcoded domain knowledge and policies.
        E.g. Health Risk V1.
        """
        outputs = {}
        aqi = context.env_state.current_aqi
        
        # Deterministic Health Risk (V1)
        if aqi > 300:
            outputs["health_risk_level"] = "SEVERE"
            outputs["outdoor_recommendation"] = "Avoid all outdoor physical activity."
            outputs["mask_required"] = True
        elif aqi > 150:
            outputs["health_risk_level"] = "UNHEALTHY"
            outputs["outdoor_recommendation"] = "Reduce prolonged exertion."
            outputs["mask_required"] = False
        else:
            outputs["health_risk_level"] = "GOOD"
            outputs["outdoor_recommendation"] = "Ideal air quality."
            outputs["mask_required"] = False
            
        return outputs
