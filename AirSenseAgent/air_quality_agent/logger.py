"""Structured JSON logger writing execution decisions and runtime metadata."""
import os
import json
import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional

from air_quality_agent.schemas import (
    FeatureVector, PredictionResult, FilterHealthResult,
    MaintenanceResult, DecisionResult, ConfidenceResult,
    ReflectionResult, ExplanationResult
)
from config.config import LOG_DIR

class AgentLogger:
    def __init__(self):
        self.log_dir = LOG_DIR
        self.log_dir.mkdir(parents=True, exist_ok=True)
        
        self.logger = logging.getLogger("AirQualityAgent")
        self.logger.setLevel(logging.INFO)
        self.logger.propagate = False
        self.logger.handlers = []
        
        log_file = self.log_dir / "agent.jsonl"
        handler = RotatingFileHandler(log_file, maxBytes=10*1024*1024, backupCount=5)
        formatter = logging.Formatter('%(message)s')
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)

    def log_cycle(self, cycle_id: str, raw_input: Dict[str, Any], features: FeatureVector, 
                  prediction: PredictionResult, filter_result: FilterHealthResult,
                  maintenance: MaintenanceResult, decision: DecisionResult, 
                  confidence: ConfidenceResult, reflection: Optional[ReflectionResult],
                  explanation: ExplanationResult, latency_ms: float, 
                  model_versions: Dict[str, str]) -> None:
        log_payload = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "cycle_id": cycle_id,
            "latency_ms": round(latency_ms, 2),
            "input": raw_input,
            "features": features.features,
            "prediction": prediction.model_dump(),
            "filter": filter_result.model_dump(),
            "maintenance": maintenance.model_dump(),
            "decision": decision.model_dump(),
            "confidence": confidence.model_dump(),
            "reflection": reflection.model_dump() if reflection else None,
            "explanation": explanation.model_dump(),
            "model_versions": model_versions
        }
        self.logger.info(json.dumps(log_payload))

    def log_error(self, module: str, error: Exception, context: Dict[str, Any]) -> None:
        error_payload = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": "ERROR",
            "module": module,
            "error_type": error.__class__.__name__,
            "error_message": str(error),
            "context": context
        }
        self.logger.error(json.dumps(error_payload))

    def log_model_event(self, event: str, model: str, version: str, metrics: Dict[str, Any]) -> None:
        event_payload = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": "INFO",
            "type": "MODEL_EVENT",
            "event": event,
            "model": model,
            "version": version,
            "metrics": metrics
        }
        self.logger.info(json.dumps(event_payload))
