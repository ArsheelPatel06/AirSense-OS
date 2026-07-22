"""
Champion-Challenger Framework.

Safeguards production by enforcing rigorous model evaluation.
A newly trained model (Challenger) must mathematically outperform the 
current production model (Champion) before it is promoted.
"""
from __future__ import annotations

import logging
from typing import Callable

logger = logging.getLogger(__name__)


class ChampionChallengerEvaluator:
    """Evaluates a Challenger model against the Champion."""

    def __init__(self, metric_func: Callable[[list[float], list[float]], float], metric_name: str = "MAE", lower_is_better: bool = True):
        """
        Args:
            metric_func: A function that takes (actuals, predictions) and returns a score.
            metric_name: Human readable name of the metric.
            lower_is_better: True if a lower score is better (like MAE/RMSE). False for Accuracy/R2.
        """
        self.metric_func = metric_func
        self.metric_name = metric_name
        self.lower_is_better = lower_is_better

    def evaluate(self, 
                 actuals: list[float], 
                 champion_preds: list[float], 
                 challenger_preds: list[float], 
                 improvement_threshold_pct: float = 1.0) -> bool:
        """
        Evaluate if the Challenger beats the Champion.
        
        Args:
            actuals: Ground truth values.
            champion_preds: Predictions from the current production model.
            challenger_preds: Predictions from the new model.
            improvement_threshold_pct: The minimum percentage improvement required for promotion.
            
        Returns:
            True if Challenger should be promoted, False otherwise.
        """
        if not actuals or len(actuals) != len(champion_preds) or len(actuals) != len(challenger_preds):
            raise ValueError("All lists must be the same length and non-empty.")

        champion_score = self.metric_func(actuals, champion_preds)
        challenger_score = self.metric_func(actuals, challenger_preds)
        
        logger.info(f"[Evaluation] Champion {self.metric_name}: {champion_score:.4f}")
        logger.info(f"[Evaluation] Challenger {self.metric_name}: {challenger_score:.4f}")

        if self.lower_is_better:
            # We want challenger < champion
            improvement = ((champion_score - challenger_score) / champion_score) * 100
        else:
            # We want challenger > champion
            improvement = ((challenger_score - champion_score) / champion_score) * 100

        logger.info(f"[Evaluation] Challenger improvement: {improvement:.2f}% (Threshold: {improvement_threshold_pct}%)")

        if improvement >= improvement_threshold_pct:
            logger.info("[Evaluation] 🏆 Challenger has DEFEATED the Champion!")
            return True
        else:
            logger.info("[Evaluation] 🛡️ Champion retains its title.")
            return False
