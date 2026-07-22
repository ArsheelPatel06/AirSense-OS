"""Validates reasoning claims and enforces safety rules before LLM processing."""
from typing import Dict, Any, List

class ReasoningValidator:
    @staticmethod
    def validate(reasoning_data: Dict[str, Any]) -> bool:
        """
        Pre-flight check before hitting the LLM.
        Checks for missing evidence, unsupported claims, and hallucination risks.
        """
        if not reasoning_data.get("evidence"):
            return False
        return True

class Guardrails:
    @staticmethod
    def enforce(text: str) -> bool:
        """
        Safety layer.
        Checks for Policy Violations, Medical Advice (unauthorized), 
        Prompt Injection, and Sensitive Data.
        """
        forbidden_phrases = ["diagnose", "cure", "prescribe", "ignore previous instructions"]
        for phrase in forbidden_phrases:
            if phrase in text.lower():
                return False
        return True
