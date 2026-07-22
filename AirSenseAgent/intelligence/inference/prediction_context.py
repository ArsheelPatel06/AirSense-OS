"""Context object passed through the Inference Engine pipeline."""
from typing import Dict, Any, List, Optional
from air_quality_agent.schemas import FeatureVector
from .schemas import EnvironmentalState

class PredictionContext:
    """
    Encapsulates all necessary state so modules don't require 20 arguments.
    Passed through ML, Physics, GIS, Rules, Evidence, and Confidence engines.
    """
    def __init__(self, 
                 context_id: str,
                 feature_vector: FeatureVector, 
                 env_state: EnvironmentalState,
                 working_memory: Dict[str, Any],
                 previous_predictions: List[Dict[str, Any]],
                 current_strategy: str,
                 scenario_overrides: Optional[Dict[str, Any]] = None):
        self.context_id = context_id
        self.feature_vector = feature_vector
        self.env_state = env_state
        self.working_memory = working_memory
        self.previous_predictions = previous_predictions
        self.current_strategy = current_strategy
        self.scenario_overrides = scenario_overrides or {}
        
        # Accumulators for the engines to populate as the context flows through
        self.ml_outputs: Dict[str, Any] = {}
        self.physics_outputs: Dict[str, Any] = {}
        self.spatial_outputs: Dict[str, Any] = {}
        self.rules_outputs: Dict[str, Any] = {}
        self.causal_chains: List[Dict[str, Any]] = []
        self.evidence: List[str] = []
        self.confidence: float = 0.0
        self.execution_metrics: Dict[str, float] = {}
