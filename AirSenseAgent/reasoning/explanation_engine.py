"""Tailors the ReasoningResult for specific audiences."""
from typing import Dict, Any
from .reasoning_engine import ReasoningResult

class ExplanationEngine:
    @staticmethod
    def tailor(reasoning: ReasoningResult, audience: str) -> Dict[str, Any]:
        """
        Filters and rewording logic for different audiences before LLM formatting.
        - Citizen: Simple language, actionable.
        - Government: Technical, policy-heavy.
        - Organization: Operational, HVAC-focused.
        """
        explanation = {}
        if audience == "citizen":
            explanation["tone"] = "simple, empathetic"
            explanation["focus"] = reasoning.recommendations
        elif audience == "government":
            explanation["tone"] = "formal, technical"
            explanation["focus"] = reasoning.policy_references
            
        return explanation
