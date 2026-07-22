"""
Concept Drift Detector.

Monitors the relationship between inputs and outputs (model error).
If prediction error increases significantly while input distributions remain stable,
concept drift is occurring (e.g., season change, policy change, lockdowns).
"""
from __future__ import annotations

import logging

try:
    from river import drift
    RIVER_AVAILABLE = True
except ImportError:
    RIVER_AVAILABLE = False
    drift = None

logger = logging.getLogger(__name__)


class ConceptDriftDetector:
    """
    Detects shifts in the model's error distribution using ADWIN.
    """

    def __init__(self):
        if not RIVER_AVAILABLE:
            logger.warning("[ConceptDriftDetector] River is not installed. Drift detection is disabled.")
            self.error_detector = None
        else:
            # We track the Absolute Error of the Champion model.
            self.error_detector = drift.ADWIN()

    def update(self, actual: float, predicted: float) -> bool:
        """
        Update the drift detector with a new prediction vs actual comparison.
        
        Args:
            actual: The ground truth AQI or PM2.5 value
            predicted: The Champion model's predicted value

        Returns:
            True if concept drift is detected, False otherwise.
        """
        if self.error_detector is None:
            return False

        error = abs(actual - predicted)
        self.error_detector.update(error)
        
        if self.error_detector.drift_detected:
            logger.warning("[ConceptDrift] Drift detected in model error distribution!")
            return True
            
        return False
