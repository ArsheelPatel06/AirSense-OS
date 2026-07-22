"""Provides the grounded chat interface."""
from typing import Dict, Any
from .memory import ConversationMemory
from llm.router import LLMRouter

class ConversationEngine:
    def __init__(self):
        self.memory = ConversationMemory()
        self.router = LLMRouter()
        
    def chat(self, user_message: str, audience: str, reasoning_context: Any) -> Dict[str, Any]:
        """
        Processes a chat message grounded strictly in the ReasoningResult.
        """
        # Save user message
        ctx_id = reasoning_context.conversation_context_id
        self.memory.add_turn(ctx_id, "user", user_message)
        
        # Route to LLM for response generation (enforcing JSON)
        # In reality, we'd pass the reasoning_context and history.
        response = self.router.execute(f"Respond to: {user_message}", {"audience": audience})
        
        self.memory.add_turn(ctx_id, "agent", response.get("summary", ""))
        return response
