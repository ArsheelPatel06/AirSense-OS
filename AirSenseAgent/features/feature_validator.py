"""Validates that engineered features comply with their Registry constraints."""
from typing import Dict, Any, List
from .feature_registry import FeatureRegistry
import logging

class FeatureValidator:
    def __init__(self, registry: FeatureRegistry):
        self.registry = registry
        self.logger = logging.getLogger("FeatureValidator")
        
    def validate(self, feature_vector: Dict[str, float]) -> Dict[str, float]:
        """Ensures the vector doesn't violate expected ranges or contain NaNs."""
        validated = {}
        for name, value in feature_vector.items():
            meta = self.registry.get_feature(name)
            if not meta:
                # Undocumented feature
                self.logger.warning(f"Unregistered feature detected: {name}. Dropping.")
                continue
                
            if value is None:
                if meta.is_required:
                    self.logger.error(f"Required feature {name} is None. Emitting default 0.0.")
                    validated[name] = 0.0
                continue
                
            min_val, max_val = meta.expected_range
            if not (min_val <= value <= max_val):
                self.logger.warning(f"Feature {name} value {value} out of range {meta.expected_range}. Clipping.")
                value = max(min_val, min(value, max_val))
                
            validated[name] = value
            
        return validated
