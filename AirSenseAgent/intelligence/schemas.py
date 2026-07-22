"""Shared data contracts and state objects for the Intelligence Layer."""
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime

class EnvironmentalState(BaseModel):
    """The unified state object holding the current state of the world."""
    timestamp: datetime
    current_aqi: float
    current_weather: Dict[str, Any]
    current_traffic: Dict[str, Any]
    current_wind: Dict[str, Any]
    current_reports: List[Dict[str, Any]]
    current_satellite: Dict[str, Any]
    current_season: str
    active_alerts: List[str]

class PredictionProvenance(BaseModel):
    """Government-grade audit trail for a prediction."""
    prediction_id: str
    timestamp: datetime
    model_version: str
    dataset_version: str
    feature_version: str
    execution_time_ms: float
    evidence_ids: List[str]
    knowledge_sources: List[str]

class PredictionBundle(BaseModel):
    """The ultimate payload delivered by the Inference Engine."""
    timestamp: datetime
    context_id: str
    
    # Outcomes
    predictions: Dict[str, Any]
    causal_chains: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Trust Layer
    evidence: List[str] = Field(default_factory=list)
    confidence_score: float = 0.0
    
    # Audit Trail
    provenance: PredictionProvenance
