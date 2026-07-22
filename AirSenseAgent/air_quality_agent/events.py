"""Strongly typed Event definitions for the Pub/Sub bus."""
from enum import Enum

class Events(str, Enum):
    # Pipeline Triggers
    RAW_DATA_RECEIVED = "RAW_DATA_RECEIVED"
    
    # Perception
    SENSOR_UPDATED = "SENSOR_UPDATED"
    PERCEPTION_COMPLETED = "PERCEPTION_COMPLETED"
    
    # Features
    FEATURES_READY = "FEATURES_READY"
    
    # Models
    PREDICTION_COMPLETED = "PREDICTION_COMPLETED"
    
    # Decisions
    DECISION_READY = "DECISION_READY"
    ACTION_EXECUTED = "ACTION_EXECUTED"
    
    # Alerts
    ALERT_GENERATED = "ALERT_GENERATED"
    
    # Reasoning
    REASONING_COMPLETED = "REASONING_COMPLETED"
    
    # Learning / Monitoring
    MODEL_UPDATED = "MODEL_UPDATED"
    REFLECTION_COMPLETED = "REFLECTION_COMPLETED"
    DRIFT_DETECTED = "DRIFT_DETECTED"
    ANOMALY_DETECTED = "ANOMALY_DETECTED"
