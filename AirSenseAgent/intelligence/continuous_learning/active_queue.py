"""
Active Learning Queue.

Captures low-confidence predictions. When ground truth arrives, these "hard" 
examples are prioritized in the next training snapshot, forcing the model to 
improve where it struggles most.
"""
from __future__ import annotations

import json
import logging
from datetime import datetime
from pathlib import Path

from config.settings import settings

logger = logging.getLogger(__name__)


class ActiveLearningQueue:
    """Manages the queue of low-confidence predictions for targeted retraining."""

    def __init__(self, queue_dir: str | Path | None = None):
        if queue_dir is None:
            self.queue_dir = settings.lake_path / "continuous_learning" / "active_queue"
        else:
            self.queue_dir = Path(queue_dir)
        self.queue_dir.mkdir(parents=True, exist_ok=True)
        
        # Append to a daily jsonl file
        self.current_date = datetime.utcnow().strftime("%Y-%m-%d")
        self.queue_file = self.queue_dir / f"queue_{self.current_date}.jsonl"

    def enqueue(self, 
                prediction_id: str,
                features: dict,
                prediction: float,
                confidence: float,
                reason: str) -> None:
        """
        Add a difficult example to the active learning queue.
        
        Args:
            prediction_id: Unique ID linking this to the AirSense Memory.
            features: The raw features used for prediction.
            prediction: The predicted value.
            confidence: The confidence score (0-100%).
            reason: Why the confidence was low.
        """
        # Ensure we are writing to the correct daily file
        today = datetime.utcnow().strftime("%Y-%m-%d")
        if today != self.current_date:
            self.current_date = today
            self.queue_file = self.queue_dir / f"queue_{self.current_date}.jsonl"

        record = {
            "prediction_id": prediction_id,
            "timestamp_utc": datetime.utcnow().isoformat(),
            "prediction": prediction,
            "confidence": confidence,
            "reason": reason,
            "features": features
        }
        
        with open(self.queue_file, "a") as f:
            f.write(json.dumps(record) + "\n")
            
        logger.info(f"[ActiveQueue] Enqueued prediction {prediction_id} (Confidence: {confidence}%)")

    def get_pending_count(self) -> int:
        """Count how many items are in today's queue."""
        if not self.queue_file.exists():
            return 0
        with open(self.queue_file, "r") as f:
            return sum(1 for _ in f)
