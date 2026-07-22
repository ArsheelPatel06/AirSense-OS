"""
AirSense Memory.

The ultimate source of truth for model performance and reasoning.
Tracks the entire lifecycle of a prediction:
Prediction → Actual → Error → Reason (SHAP) → Model Used → Outcome.
"""
from __future__ import annotations

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any

from config.settings import settings

logger = logging.getLogger(__name__)


class AirSenseMemory:
    """Stores the historical context of predictions and their eventual ground truth."""

    def __init__(self, memory_dir: str | Path | None = None):
        if memory_dir is None:
            self.memory_dir = settings.lake_path / "registry" / "memory"
        else:
            self.memory_dir = Path(memory_dir)
        self.memory_dir.mkdir(parents=True, exist_ok=True)

    def _get_file_path(self, date_str: str) -> Path:
        return self.memory_dir / f"memory_{date_str}.jsonl"

    def record_prediction(self,
                          prediction_id: str,
                          model_version: str,
                          features: dict[str, Any],
                          predicted_value: float,
                          confidence: float,
                          shap_reasons: dict[str, float]) -> None:
        """
        Record the initial prediction when it is made.
        """
        now = datetime.utcnow()
        record = {
            "prediction_id": prediction_id,
            "timestamp_utc": now.isoformat(),
            "event_type": "PREDICTION",
            "model_version": model_version,
            "predicted_value": predicted_value,
            "confidence": confidence,
            "shap_reasons": shap_reasons,
            "features": features
        }
        
        file_path = self._get_file_path(now.strftime("%Y-%m-%d"))
        with open(file_path, "a") as f:
            f.write(json.dumps(record) + "\n")
            
        logger.debug(f"[Memory] Recorded prediction {prediction_id} (Model: {model_version})")

    def record_outcome(self,
                       prediction_id: str,
                       actual_value: float) -> None:
        """
        Record the actual outcome when it becomes available.
        (Usually hours or days after the prediction).
        """
        now = datetime.utcnow()
        record = {
            "prediction_id": prediction_id,
            "timestamp_utc": now.isoformat(),
            "event_type": "OUTCOME",
            "actual_value": actual_value
        }
        
        file_path = self._get_file_path(now.strftime("%Y-%m-%d"))
        with open(file_path, "a") as f:
            f.write(json.dumps(record) + "\n")
            
        logger.debug(f"[Memory] Recorded outcome for {prediction_id}")
