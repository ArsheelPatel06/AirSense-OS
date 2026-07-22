"""Offline feature selection utilities to cull from 150 -> 45 features before training."""
import logging

class FeatureSelector:
    """
    Reserved for offline pipeline. Evaluates feature importance.
    Not used during online inference.
    """
    def __init__(self):
        self.logger = logging.getLogger("FeatureSelector")

    def correlation_matrix(self, dataset: Any):
        """Removes highly correlated redundant features."""
        pass

    def variance_threshold(self, dataset: Any, threshold: float = 0.01):
        """Removes zero-variance (constant) features."""
        pass
        
    def shap_importance(self, model: Any, dataset: Any):
        """Calculates SHAP values for global feature importance."""
        pass
        
    def permutation_importance(self, model: Any, dataset: Any):
        """Shuffles features to observe performance degradation."""
        pass
