"""Calculates the overall confidence score of the entire inference cycle."""
from typing import Dict, Any

class ConfidenceBuilder:
    def __init__(self):
        pass
        
    def calculate(self, context: Any) -> float:
        """
        Fuses ML model confidence, data quality, and environmental stability
        into a single reliability score for the PredictionBundle.
        """
        # Start at a baseline
        confidence = 0.85
        
        # Adjust for data quality
        # e.g., if we had to impute a lot of missing sensors, lower confidence.
        # This will tie into the PerceptionReport in reality.
        
        # Example penalty
        if not context.feature_vector.features:
            confidence -= 0.5
            
        # Example boost
        if "rain_wash_effect" in context.physics_outputs:
            # Physical constraints are deterministic and highly confident
            confidence += 0.1
            
        return max(0.0, min(1.0, confidence))
