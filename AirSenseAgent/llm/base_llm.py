"""Clean Architecture Interface for LLMs."""
from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseLLMAdapter(ABC):
    """
    Contract for all LLMs. 
    MUST return Structured JSON. NEVER free-form text.
    """
    @abstractmethod
    def generate(self, prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes the LLM request and returns a guaranteed JSON response mapping to:
        { "summary": "", "recommendation": "", "warnings": [], "citations": [], "confidence": "" }
        """
        pass
