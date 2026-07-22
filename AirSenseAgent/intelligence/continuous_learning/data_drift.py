"""
Data Drift Detector.

Monitors incoming FeatureVectors for shifts in input distributions (e.g., sudden PM2.5 spikes).
Uses ADWIN (ADaptive WINdowing) from the River library.
"""
from __future__ import annotations

import logging
from dataclasses import asdict

from intelligence.feature_builder.feature_vector import FeatureVector

try:
    from river import drift
    RIVER_AVAILABLE = True
except ImportError:
    RIVER_AVAILABLE = False
    drift = None

logger = logging.getLogger(__name__)


class DataDriftDetector:
    """
    Detects shifts in input distributions over time using ADWIN.
    Maintains a separate ADWIN instance for each critical feature.
    """

    # Features we care about for drift
    MONITORED_FEATURES = ["pm25", "pm10", "no2", "temperature", "humidity", "wind_speed"]

    def __init__(self):
        if not RIVER_AVAILABLE:
            logger.warning("[DataDriftDetector] River is not installed. Drift detection is disabled.")
            self.detectors = {}
        else:
            self.detectors = {
                feature: drift.ADWIN() for feature in self.MONITORED_FEATURES
            }

    def update(self, feature_vector: FeatureVector) -> list[str]:
        """
        Update the drift detectors with a new feature vector.
        
        Args:
            feature_vector: A single new observation.

        Returns:
            A list of feature names that have drifted.
        """
        if not self.detectors:
            return []

        drifted_features = []
        data = asdict(feature_vector)
        
        for feature, detector in self.detectors.items():
            val = data.get(feature)
            if val is not None:
                detector.update(float(val))
                if detector.drift_detected:
                    logger.warning(f"[DataDrift] Drift detected in feature: {feature}")
                    drifted_features.append(feature)
                    
        return drifted_features
