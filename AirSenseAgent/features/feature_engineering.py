"""The computation engine that produces the FeatureVector."""
from typing import Dict, Any
from perception.schemas import PerceivedEnvironment
from .feature_registry import FeatureRegistry
from .feature_validator import FeatureValidator
from air_quality_agent.schemas import FeatureVector
import math
from datetime import datetime

class FeatureEngineeringEngine:
    def __init__(self):
        self.registry = FeatureRegistry()
        self.validator = FeatureValidator(self.registry)
        
    def extract_features(self, env: PerceivedEnvironment) -> FeatureVector:
        """
        Consumes the Perception output and produces a deterministic FeatureVector.
        """
        raw_features = {}
        
        # 1. Environmental (Direct Passthrough)
        raw_features["pm25"] = env.fused_sensors.get("pm25", 0.0)
        
        # 2. Historical (Mocked moving averages for now)
        # Real implementation would query WorkingMemory for the trailing buffer
        raw_features["pm25_rolling_mean_6h"] = raw_features["pm25"] * 0.95 
        raw_features["aqi_velocity"] = 5.0 # Mock derivative
        
        # 3. Temporal (Cyclical encoding)
        hour = env.timestamp.hour
        raw_features["hour_sin"] = math.sin(hour * 2 * math.pi / 24)
        
        # 4. Spatial & Satellite (From context)
        raw_features["distance_to_industry"] = env.environmental_context.get("satellite_distance_to_industry", 12.5)
        raw_features["no2_column"] = env.environmental_context.get("satellite_no2_column", 2.1)
        
        # Validation
        validated = self.validator.validate(raw_features)
        
        return FeatureVector(
            features=validated,
            completeness=1.0 # Calculated properly in full version
        )
