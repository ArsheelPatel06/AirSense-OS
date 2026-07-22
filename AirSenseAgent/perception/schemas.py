"""Pydantic schemas specific to the Perception Layer data contracts."""
from pydantic import BaseModel, Field
from typing import Dict, Any, List
from datetime import datetime

class UnifiedObservation(BaseModel):
    """The result of fusing all external data streams."""
    timestamp: datetime
    iot_sensors: Dict[str, float] = Field(default_factory=dict)
    satellite: Dict[str, float] = Field(default_factory=dict)
    citizen: Dict[str, Any] = Field(default_factory=dict)
    weather: Dict[str, Any] = Field(default_factory=dict)
    traffic: Dict[str, Any] = Field(default_factory=dict)
    drone: Dict[str, Any] = Field(default_factory=dict)

class PerceptionReport(BaseModel):
    """Metadata and quality metrics generated during perception."""
    overall_quality_score: float = 1.0
    completeness_score: float = 1.0
    freshness_score: float = 1.0
    issues: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    imputed_fields: List[str] = Field(default_factory=list)

class PerceivedEnvironment(BaseModel):
    """The final, sanitized output of the entire Perception Layer."""
    timestamp: datetime
    fused_sensors: Dict[str, float]
    environmental_context: Dict[str, Any]
    
    @property
    def is_valid(self):
        return len(self.fused_sensors) > 0
