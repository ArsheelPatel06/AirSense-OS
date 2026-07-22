"""Common data contracts and schema validation rules using Pydantic."""
from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any, List

class AgentInput(BaseModel):
    pm25: float = Field(default=0.0)
    hour: int = Field(default=12)
    usage_hours: float = Field(default=0.0)
    gas_index: float = Field(default=0.0)
    current_fan_speed: str = Field(default="OFF")
    history_pm25: List[float] = Field(default_factory=list)
    override: Dict[str, Any] = Field(default_factory=dict)
    
    pm10: Optional[float] = Field(default=None)
    temperature: Optional[float] = Field(default=None)
    humidity: Optional[float] = Field(default=None)
    wind_speed: Optional[float] = Field(default=None)

    @field_validator('pm25', 'usage_hours', 'gas_index')
    @classmethod
    def clamp_non_negative(cls, v: float) -> float:
        return max(0.0, float(v))

    @field_validator('hour')
    @classmethod
    def validate_hour(cls, v: int) -> int:
        return int(v) % 24

    @field_validator('current_fan_speed')
    @classmethod
    def normalize_fan_speed(cls, v: str) -> str:
        return str(v).upper()

class FeatureVector(BaseModel):
    features: Dict[str, Optional[float]]
    completeness: float

class PredictionResult(BaseModel):
    aqi_next_hour: float
    pm25_next_hour: float
    spike_warning: bool
    confidence: float
    model_version: str = "v1"

class FilterHealthResult(BaseModel):
    health_pct: float
    remaining_hours: Optional[float] = None
    remaining_days: Optional[float] = None
    replacement_date: Optional[str] = None
    status: str
    confidence: float
    model_version: str = "v1"

class MaintenanceResult(BaseModel):
    fan_efficiency: float
    component_risks: Dict[str, float] = Field(default_factory=dict)
    primary_wear_driver: Optional[str] = None
    insights: List[str] = Field(default_factory=list)

class ConfidenceResult(BaseModel):
    score: float
    level: str
    components: Dict[str, float] = Field(default_factory=dict)

class DecisionResult(BaseModel):
    fan_speed: str
    reason: str
    alert: Optional[str] = None

class AnomalyResult(BaseModel):
    is_anomalous: bool = False
    anomalies: List[str] = Field(default_factory=list)
    sensor_health: float = 1.0

class ReflectionResult(BaseModel):
    prediction_error: Optional[float] = None
    reward: Optional[float] = None
    lessons: List[str] = Field(default_factory=list)

class ExplanationResult(BaseModel):
    summary: str
    top_factors: List[Dict[str, Any]] = Field(default_factory=list)
    citizen_guidance: Optional[Dict[str, Any]] = None
    source: str = "fallback"

class AgentOutput(BaseModel):
    status: PredictionResult
    filter: FilterHealthResult
    maintenance: MaintenanceResult
    decision: DecisionResult
    confidence: ConfidenceResult
    anomaly: Optional[AnomalyResult] = None
    reflection: Optional[ReflectionResult] = None
    explanation: ExplanationResult
    agent_performance: float = 0.5
    cycle_id: str = ""
    timestamp: str = ""
    model_versions: Dict[str, str] = Field(default_factory=dict)
