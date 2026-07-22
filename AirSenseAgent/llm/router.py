"""Routes requests to interchangeable LLM adapters."""
from typing import Dict, Any
from .base_llm import BaseLLMAdapter
from .gemini_adapter import GeminiAdapter
from .openai_adapter import OpenAIAdapter

class LLMRouter:
    def __init__(self, primary_provider: str = "gemini"):
        self.adapters = {
            "gemini": GeminiAdapter(),
            "openai": OpenAIAdapter()
        }
        self.primary = self.adapters.get(primary_provider, GeminiAdapter())
        
    def execute(self, prompt: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Routes the request. If primary fails, can fallback to local/other."""
        try:
            return self.primary.generate(prompt, context)
        except Exception:
            # Fallback logic here
            return {
                "summary": "LLM Outage. Fallback deterministic summary.",
                "recommendation": "Maintain standard operations.",
                "warnings": ["LLM Offline"],
                "citations": [],
                "confidence": "Deterministic Default"
            }
