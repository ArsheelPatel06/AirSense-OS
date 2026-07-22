from typing import Any, List, Dict
from pydantic import BaseModel

class StationResponse(BaseModel):
    station_id: str
    city: str
    location: dict[str, float]
    status: str

class ForecastResponse(BaseModel):
    station_id: str
    timestamps: List[str]
    predicted_aqi: List[float]
    confidence_bounds: Dict[str, List[float]] | None = None

class AlertResponse(BaseModel):
    level: str
    title: str
    message: str
    aqi_current: int
    issued_at: str

class InsightResponse(BaseModel):
    station_id: str
    generated_at: str
    alert_level: str
    top_cause: str
    natural_language_summary: str

class RecommendationResponse(BaseModel):
    stakeholder: str
    priority: str
    actions: List[str]
    cause_specific: List[str]

class ScenarioResponse(BaseModel):
    scenario_name: str
    base_prediction: float
    modified_prediction: float
    delta: float
    delta_pct: float
    interpretation: str
