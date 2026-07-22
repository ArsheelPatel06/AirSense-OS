"""Translates numerical predictions and graphs into human-readable evidence."""
from typing import Dict, Any, List

class EvidenceBuilder:
    def __init__(self):
        pass
        
    def build(self, context: Any) -> List[str]:
        """
        Synthesizes the outputs from ML, Physics, GIS, and Rules into clear evidence strings.
        This provides the reasoning for Gemini and Government audits.
        """
        evidence = []
        
        # Example rules
        traffic = context.env_state.current_traffic.get("congestion_score", 0.0)
        if traffic > 0.8:
            evidence.append(f"Traffic density is critical ({traffic*100}%). This is the primary driver of incoming NO2 spikes.")
            
        if "rain_wash_effect" in context.physics_outputs:
            evidence.append("Heavy rainfall is actively washing PM2.5 from the atmosphere, capping peak pollution.")
            
        if context.rules_outputs.get("health_risk_level") == "SEVERE":
            evidence.append("WHO/CPCB guidelines dictate SEVERE risk based on current 24h trailing averages.")
            
        return evidence
