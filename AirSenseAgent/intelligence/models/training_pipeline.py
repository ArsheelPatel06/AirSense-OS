"""
Training Pipeline.

Standardised training loop for all AirSense models.
Integrates:
  - Optuna hyperparameter search (when enabled)
  - Champion-Challenger evaluation via the existing framework
  - Dataset Snapshots for full reproducibility
  - Model Registry persistence

Usage:
    from intelligence.models.training_pipeline import TrainingPipeline
    from intelligence.models.factory import ModelFactory

    pipeline = TrainingPipeline()
    result = pipeline.train(
        capability="aqi_forecast",
        algorithm="lightgbm",
        snapshot_id="delhi_summer_20260701T000000Z",
        target_column="calculated_aqi",
        use_hpo=True,
    )
"""
from __future__ import annotations

import json
import logging
import pickle
from datetime import datetime
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import TimeSeriesSplit

from config.settings import settings
from intelligence.datasets.snapshot import DatasetSnapshotManager
from intelligence.inference.champion_challenger import ChampionChallengerEvaluator
from intelligence.models.factory import ModelFactory

logger = logging.getLogger(__name__)


class TrainingPipeline:
    """Full reproducible training loop with optional Optuna HPO."""

    def __init__(self, experiment_root: str | Path | None = None):
        self.factory = ModelFactory()
        self.snapshot_manager = DatasetSnapshotManager()
        self.experiment_root = Path(experiment_root or (settings.lake_path / "experiments"))
        self.experiment_root.mkdir(parents=True, exist_ok=True)

    def train(self,
              capability: str,
              algorithm: str,
              snapshot_id: str,
              target_column: str,
              exclude_columns: list[str] | None = None,
              params: dict[str, Any] | None = None,
              use_hpo: bool = False,
              n_hpo_trials: int = 20,
              val_folds: int = 5) -> dict:
        """
        Load a snapshot, train a model, evaluate, and persist.

        Returns:
            dict with metrics, experiment_id, and model path.
        """
        # ── 1. Load snapshot ─────────────────────────────────────────────────
        logger.info(f"[TrainingPipeline] Loading snapshot: {snapshot_id}")
        df = self.snapshot_manager.load_snapshot(snapshot_id)

        exclude = set(exclude_columns or []) | {
            target_column, "timestamp", "ingested_at", "station_id",
            "station_name", "city", "state", "source_ids", "provenance_hash",
        }
        feature_cols = [c for c in df.columns if c not in exclude and df[c].dtype in [float, int, "float64", "int64"]]
        X = df[feature_cols].fillna(0)
        y = df[target_column].fillna(method="ffill").fillna(0)

        # ── 2. Time-series split ─────────────────────────────────────────────
        # Use the last fold as validation; this prevents data leakage.
        tscv = TimeSeriesSplit(n_splits=val_folds)
        for train_idx, val_idx in tscv.split(X):
            pass  # We want the final split only
        X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
        y_train, y_val = y.iloc[train_idx], y.iloc[val_idx]

        logger.info(f"[TrainingPipeline] Train size: {len(X_train)}, Val size: {len(X_val)}")

        # ── 3. Optional HPO ──────────────────────────────────────────────────
        if use_hpo:
            params = self._run_hpo(capability, algorithm, X_train, y_train, n_hpo_trials)

        # ── 4. Train model ───────────────────────────────────────────────────
        model = self.factory.create(capability, algorithm, params or {})
        model.fit(X_train, y_train, feature_names=feature_cols)

        # ── 5. Evaluate ──────────────────────────────────────────────────────
        preds = model.predict(X_val)
        metrics = self._compute_regression_metrics(y_val.to_numpy(), preds)
        logger.info(f"[TrainingPipeline] Metrics: {metrics}")

        # ── 6. Persist experiment ────────────────────────────────────────────
        experiment_id = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
        experiment_dir = self.experiment_root / f"{capability}_{experiment_id}"
        experiment_dir.mkdir(parents=True)

        model_path = experiment_dir / "model.pkl"
        with open(model_path, "wb") as f:
            pickle.dump(model, f)

        config = {
            "capability": capability,
            "algorithm": algorithm,
            "snapshot_id": snapshot_id,
            "target_column": target_column,
            "feature_columns": feature_cols,
            "params": params or {},
            "train_rows": len(X_train),
            "val_rows": len(X_val),
            "trained_at_utc": datetime.utcnow().isoformat(),
        }
        (experiment_dir / "config.json").write_text(json.dumps(config, indent=2))
        (experiment_dir / "metrics.json").write_text(json.dumps(metrics, indent=2))

        logger.info(f"[TrainingPipeline] Experiment saved to: {experiment_dir}")

        return {
            "experiment_id": experiment_id,
            "experiment_dir": str(experiment_dir),
            "model_path": str(model_path),
            "metrics": metrics,
        }

    @staticmethod
    def _compute_regression_metrics(actuals: np.ndarray, preds: np.ndarray) -> dict:
        mae = float(mean_absolute_error(actuals, preds))
        rmse = float(np.sqrt(mean_squared_error(actuals, preds)))
        r2 = float(r2_score(actuals, preds))
        # MAPE – guard against division by zero
        mask = actuals != 0
        mape = float(np.mean(np.abs((actuals[mask] - preds[mask]) / actuals[mask])) * 100) if mask.any() else 0.0
        bias = float(np.mean(preds - actuals))
        return {"mae": mae, "rmse": rmse, "r2": r2, "mape_pct": mape, "bias": bias}

    def _run_hpo(self, capability: str, algorithm: str, X_train, y_train, n_trials: int) -> dict:
        """Optuna hyperparameter search with time-series cross-validation."""
        try:
            import optuna
            optuna.logging.set_verbosity(optuna.logging.WARNING)
        except ImportError:
            logger.warning("[TrainingPipeline] Optuna not installed. Skipping HPO.")
            return {}

        tscv = TimeSeriesSplit(n_splits=3)

        def objective(trial: optuna.Trial) -> float:
            if algorithm == "lightgbm":
                params = {
                    "n_estimators": trial.suggest_int("n_estimators", 100, 1000),
                    "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.3, log=True),
                    "num_leaves": trial.suggest_int("num_leaves", 15, 127),
                    "min_child_samples": trial.suggest_int("min_child_samples", 5, 100),
                }
            elif algorithm == "xgboost":
                params = {
                    "n_estimators": trial.suggest_int("n_estimators", 100, 1000),
                    "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.3, log=True),
                    "max_depth": trial.suggest_int("max_depth", 3, 10),
                }
            else:
                params = {"n_estimators": trial.suggest_int("n_estimators", 50, 500)}

            cv_maes = []
            for train_idx, val_idx in tscv.split(X_train):
                m = self.factory.create(capability, algorithm, params)
                m.fit(X_train.iloc[train_idx], y_train.iloc[train_idx])
                preds = m.predict(X_train.iloc[val_idx])
                cv_maes.append(mean_absolute_error(y_train.iloc[val_idx], preds))
            return float(np.mean(cv_maes))

        study = optuna.create_study(direction="minimize")
        study.optimize(objective, n_trials=n_trials, show_progress_bar=False)
        best_params = study.best_params
        logger.info(f"[HPO] Best params for {capability}/{algorithm}: {best_params} (MAE: {study.best_value:.4f})")
        return best_params
