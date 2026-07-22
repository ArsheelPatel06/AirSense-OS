"""
Model Factory.

A unified factory for all AirSense prediction capabilities.
Applications request a model by capability name (e.g., "aqi_forecast").
The factory resolves to the configured algorithm (LightGBM, XGBoost, RF, etc.)
without the caller ever needing to know the underlying implementation.

Changing algorithms becomes a configuration change, not a code rewrite.

Usage:
    from intelligence.models.factory import ModelFactory

    factory = ModelFactory()
    model = factory.create("aqi_forecast", algorithm="lightgbm")
    model.fit(X_train, y_train)
    predictions = model.predict(X_val)
"""
from __future__ import annotations

import logging
from typing import Any

import numpy as np

logger = logging.getLogger(__name__)


# ── Algorithm availability guards ─────────────────────────────────────────────

def _try_import_lightgbm():
    try:
        import lightgbm as lgb
        return lgb
    except ImportError:
        return None


def _try_import_xgboost():
    try:
        import xgboost as xgb
        return xgb
    except ImportError:
        return None


def _try_import_sklearn():
    try:
        from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
        from sklearn.linear_model import Ridge
        return RandomForestRegressor, GradientBoostingRegressor, Ridge
    except ImportError:
        return None, None, None


# ── Prediction horizon constants ───────────────────────────────────────────────
FORECAST_HORIZONS = [1, 3, 6, 12, 24, 48, 72]   # hours ahead


# ── Base wrapper ──────────────────────────────────────────────────────────────

class AirSenseModel:
    """
    Thin wrapper around any sklearn-compatible estimator.
    Exposes a consistent fit/predict/score API to the rest of AirSense.
    """

    def __init__(self, capability: str, algorithm: str, estimator: Any):
        self.capability = capability
        self.algorithm = algorithm
        self.estimator = estimator
        self.feature_names_: list[str] = []
        self.is_fitted = False

    def fit(self, X, y, feature_names: list[str] | None = None) -> "AirSenseModel":
        import pandas as pd
        if isinstance(X, pd.DataFrame):
            self.feature_names_ = list(X.columns)
        elif feature_names:
            self.feature_names_ = feature_names

        self.estimator.fit(X, y)
        self.is_fitted = True
        logger.info(f"[ModelFactory] Fitted {self.capability} ({self.algorithm})")
        return self

    def predict(self, X) -> np.ndarray:
        if not self.is_fitted:
            raise RuntimeError("Model has not been fitted yet. Call fit() first.")
        return np.asarray(self.estimator.predict(X))

    def score(self, X, y) -> float:
        return float(self.estimator.score(X, y))

    def __repr__(self) -> str:
        return f"AirSenseModel(capability={self.capability!r}, algorithm={self.algorithm!r}, fitted={self.is_fitted})"


# ── Factory ───────────────────────────────────────────────────────────────────

class ModelFactory:
    """
    Creates AirSense model wrappers by capability and algorithm.

    Registered capabilities:
        aqi_forecast           — Predict overall AQI index
        pm25_forecast          — Predict PM2.5 concentration
        pm10_forecast          — Predict PM10 concentration
        pollutant_forecast     — Generic pollutant regressor
        pollution_spike        — Binary: will a hazardous spike occur?
        sensor_imputation      — Estimate missing sensor reading
    """

    CAPABILITIES = {
        "aqi_forecast",
        "pm25_forecast",
        "pm10_forecast",
        "pollutant_forecast",
        "pollution_spike",
        "sensor_imputation",
    }

    ALGORITHMS = {
        "lightgbm",
        "xgboost",
        "random_forest",
        "ridge",         # Fast linear baseline
    }

    def create(self,
               capability: str,
               algorithm: str = "lightgbm",
               params: dict[str, Any] | None = None) -> AirSenseModel:
        """
        Instantiate a model for the given capability and algorithm.

        Args:
            capability: One of the registered capability names.
            algorithm:  The underlying algorithm to use.
            params:     Algorithm-specific hyperparameters.

        Returns:
            AirSenseModel wrapping the requested estimator.
        """
        if capability not in self.CAPABILITIES:
            raise ValueError(
                f"Unknown capability '{capability}'. "
                f"Available: {sorted(self.CAPABILITIES)}"
            )
        if algorithm not in self.ALGORITHMS:
            raise ValueError(
                f"Unknown algorithm '{algorithm}'. "
                f"Available: {sorted(self.ALGORITHMS)}"
            )

        params = params or {}
        is_classification = (capability == "pollution_spike")

        estimator = self._build_estimator(algorithm, is_classification, params)
        model = AirSenseModel(capability=capability, algorithm=algorithm, estimator=estimator)
        logger.info(f"[ModelFactory] Created {capability} → {algorithm}")
        return model

    @staticmethod
    def _build_estimator(algorithm: str, classification: bool, params: dict) -> Any:
        if algorithm == "lightgbm":
            lgb = _try_import_lightgbm()
            if lgb is None:
                logger.warning("[ModelFactory] LightGBM not installed; falling back to Random Forest.")
                return ModelFactory._build_rf(classification, params)
            task = "binary" if classification else "regression"
            default_params = {
                "objective": task,
                "n_estimators": params.get("n_estimators", 500),
                "learning_rate": params.get("learning_rate", 0.05),
                "num_leaves": params.get("num_leaves", 63),
                "verbose": -1,
            }
            cls = lgb.LGBMClassifier if classification else lgb.LGBMRegressor
            return cls(**{**default_params, **params})

        elif algorithm == "xgboost":
            xgb = _try_import_xgboost()
            if xgb is None:
                logger.warning("[ModelFactory] XGBoost not installed; falling back to Random Forest.")
                return ModelFactory._build_rf(classification, params)
            default_params = {
                "n_estimators": params.get("n_estimators", 500),
                "learning_rate": params.get("learning_rate", 0.05),
                "max_depth": params.get("max_depth", 6),
                "tree_method": "hist",
                "verbosity": 0,
            }
            cls = xgb.XGBClassifier if classification else xgb.XGBRegressor
            return cls(**{**default_params, **params})

        elif algorithm == "random_forest":
            return ModelFactory._build_rf(classification, params)

        elif algorithm == "ridge":
            _, _, Ridge = _try_import_sklearn()
            if Ridge is None:
                raise RuntimeError("scikit-learn is required.")
            return Ridge(alpha=params.get("alpha", 1.0))

    @staticmethod
    def _build_rf(classification: bool, params: dict) -> Any:
        RandomForestRegressor, _, _ = _try_import_sklearn()
        if RandomForestRegressor is None:
            raise RuntimeError("scikit-learn is required.")
        from sklearn.ensemble import RandomForestClassifier
        cls = RandomForestClassifier if classification else RandomForestRegressor
        return cls(
            n_estimators=params.get("n_estimators", 200),
            n_jobs=-1,
        )
