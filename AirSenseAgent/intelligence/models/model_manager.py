"""Plugin-based Model Manager for ML algorithms."""
from typing import Dict, Any, List
import logging
from abc import ABC, abstractmethod

class BaseAirSenseModel(ABC):
    """The strict contract for all ML models in AirSense."""
    @abstractmethod
    def train(self, dataset: Any, **kwargs): pass
    @abstractmethod
    def predict(self, features: Any) -> Dict[str, Any]: pass
    @abstractmethod
    def evaluate(self, dataset: Any) -> Dict[str, float]: pass
    @abstractmethod
    def save(self, path: str): pass
    @abstractmethod
    def load(self, path: str): pass
    @abstractmethod
    def version(self) -> str: pass

class ModelManager:
    """
    Manages the lifecycle and execution of all registered ML models.
    Supports plugins (LightGBM, XGBoost, RF).
    """
    def __init__(self):
        self.logger = logging.getLogger("ModelManager")
        self._registered_models: Dict[str, BaseAirSenseModel] = {}
        
    def register_model(self, name: str, model: BaseAirSenseModel):
        self._registered_models[name] = model
        self.logger.info(f"Registered model plugin: {name} (v{model.version()})")
        
    def disable_model(self, name: str):
        if name in self._registered_models:
            del self._registered_models[name]
            
    def predict_all(self, feature_vector: Any) -> Dict[str, Any]:
        """Runs inference across all active ML models."""
        outputs = {}
        for name, model in self._registered_models.items():
            try:
                outputs[name] = model.predict(feature_vector)
            except Exception as e:
                self.logger.error(f"Model {name} failed: {e}")
                outputs[name] = {"error": str(e)}
        return outputs
