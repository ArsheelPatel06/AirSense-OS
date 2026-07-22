"""The core transformer of structured cognition into logical reasoning."""
from typing import Dict, Any, List
from pydantic import BaseModel
from .citation_engine import CitationEngine
from .validator import ReasoningValidator

class ReasoningResult(BaseModel):
    """The unified data contract delivered to the LLM Routers."""
    summary: str
    detailed_explanation: str
    evidence_references: List[Any]
    policy_references: List[Any]
    confidence_explanation: str
    recommendations: List[str]
    warnings: List[str]
    generated_reports: List[str]
    conversation_context_id: str

class ReasoningEngine:
    def __init__(self):
        self.citation = CitationEngine()
        self.validator = ReasoningValidator()
        
    def generate_reasoning(self, bundle: Any, decision: Any, knowledge: Any) -> ReasoningResult:
        """
        Synthesizes the outputs of Phases 1-5 into the structured ReasoningResult.
        This answers the 'Why' (Why did AQI increase? Why was drone deployed?).
        """
        # Simulated transformation
        evidence_with_citations = self.citation.attach_citations(bundle.evidence)
        
        raw_reasoning = {
            "evidence": evidence_with_citations,
            "decision": decision
        }
        
        # Guardrail / Validator Check
        if not self.validator.validate(raw_reasoning):
            raise ValueError("Reasoning Validation Failed. Missing crucial evidence.")
            
        return ReasoningResult(
            summary="Traffic restrictions applied due to severe PM2.5 spike.",
            detailed_explanation="...",
            evidence_references=evidence_with_citations,
            policy_references=["cpcb_2023_04"],
            confidence_explanation="High confidence due to satellite alignment with ground sensors.",
            recommendations=["Divert traffic from Sector 4"],
            warnings=[],
            generated_reports=[],
            conversation_context_id="ctx_992"
        )
