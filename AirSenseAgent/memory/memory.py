"""Facade/Orchestrator for the entire Cognitive Memory layer."""
from .working_memory import WorkingMemory
from .episodic_memory import EpisodicMemory
from .semantic_memory import SemanticMemory
from .long_term_memory import LongTermMemory
import logging

class MemoryLayer:
    def __init__(self):
        self.logger = logging.getLogger("MemoryLayer")
        self.working = WorkingMemory()
        self.episodic = EpisodicMemory()
        self.semantic = SemanticMemory()
        self.long_term = LongTermMemory()
        self.logger.info("Cognitive Memory Layer initialized successfully.")

    def close(self):
        if self.long_term.client:
            self.long_term.client.close()
            self.logger.info("Long Term Memory connection closed.")
