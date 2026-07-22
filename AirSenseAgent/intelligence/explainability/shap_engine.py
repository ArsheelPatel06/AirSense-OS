"""
SHAP Explainability Engine.

Extracts feature importance and decomposes single predictions into percentage contributions.
(e.g., "PM2.5: 62%, Wind Speed: 14%, Humidity: 11%").
"""
from __future__ import annotations

import logging
from typing import Any

import numpy as np
import pandas as pd

try:
    import shap
    SHAP_AVAILABLE = True
except ImportError:
    SHAP_AVAILABLE = False

logger = logging.getLogger(__name__)


class SHAPEngine:
    """
    Decomposes predictions using SHAP (SHapley Additive exPlanations).
    Designed to wrap tree-based models (XGBoost, LightGBM, Random Forest).
    """

    def __init__(self, model: Any, background_data: pd.DataFrame | None = None):
        """
        Initialize the SHAP explainer for a given model.
        
        Args:
            model: The trained tree-based model
            background_data: Optional background dataset for KernelExplainer if TreeExplainer fails.
        """
        self.model = model
        self.explainer = None
        
        if not SHAP_AVAILABLE:
            logger.warning("[SHAPEngine] shap package not installed. Explainability disabled.")
            return

        try:
            # TreeExplainer is fastest and exact for XGBoost/LightGBM/RF
            self.explainer = shap.TreeExplainer(model)
        except Exception as e:
            logger.warning(f"[SHAPEngine] TreeExplainer failed: {e}. Falling back to KernelExplainer if background data provided.")
            if background_data is not None:
                # Use a small sample of background data (e.g., kmeans) for KernelExplainer
                sample = shap.sample(background_data, 100)
                self.explainer = shap.KernelExplainer(model.predict, sample)
            else:
                logger.error("[SHAPEngine] Cannot initialize explainer without background data.")

    def explain_prediction(self, features_df: pd.DataFrame) -> dict[str, float]:
        """
        Calculate the percentage contribution of each feature to a specific prediction.
        
        Args:
            features_df: A DataFrame with exactly 1 row containing the prediction features.
            
        Returns:
            A dictionary mapping feature names to their percentage contribution (summing to 100).
        """
        if self.explainer is None or not SHAP_AVAILABLE:
            return {}

        if len(features_df) != 1:
            raise ValueError("explain_prediction requires exactly 1 row of features.")

        # Compute SHAP values
        shap_values = self.explainer.shap_values(features_df)
        
        # Depending on the model, shap_values might be a list (multiclass) or a single array
        if isinstance(shap_values, list):
            # Take the explanation for the predicted class (assuming binary/first class for simplicity here)
            # In a real multiclass scenario, you'd need the predicted class index.
            vals = np.abs(shap_values[1][0])
        else:
            vals = np.abs(shap_values[0])
            
        feature_names = features_df.columns.tolist()
        
        # Calculate percentage contributions
        total_importance = np.sum(vals)
        if total_importance == 0:
            return {f: 0.0 for f in feature_names}
            
        contributions = {}
        for feature, val in zip(feature_names, vals):
            percentage = round((val / total_importance) * 100, 2)
            contributions[feature] = percentage
            
        # Sort by contribution (highest first)
        sorted_contributions = dict(sorted(contributions.items(), key=lambda item: item[1], reverse=True))
        
        return sorted_contributions
