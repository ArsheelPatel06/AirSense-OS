"""
Scenario Simulator.

Enables operators to ask "What if?" questions:
  - What if wind speed increases by 5 km/h?
  - What if it rains tomorrow?
  - What if construction stops?

The simulator modifies the current Feature Vector and runs it
through the production model to generate a counterfactual prediction.
This helps policymakers explore interventions BEFORE implementing them.

Usage:
    from intelligence.reasoning.scenario_simulator import ScenarioSimulator

    sim = ScenarioSimulator(model=champion_model)
    result = sim.run(
        base_features=current_features,
        modifications={"wind_speed": +5.0, "rain": 5.0}
    )
"""
from __future__ import annotations

import copy
import logging
from dataclasses import dataclass
from typing import Any

logger = logging.getLogger(__name__)


@dataclass
class ScenarioResult:
    scenario_name: str
    base_prediction: float
    modified_prediction: float
    delta: float
    delta_pct: float
    modifications: dict[str, Any]
    interpretation: str


class ScenarioSimulator:
    """
    Runs counterfactual predictions by modifying input features.
    """

    def __init__(self, model: Any):
        """
        Args:
            model: Any fitted AirSenseModel that exposes a .predict(X) method.
        """
        self.model = model

    def run(self,
            base_features: dict[str, float],
            modifications: dict[str, float],
            scenario_name: str = "Custom Scenario",
            as_delta: bool = True) -> ScenarioResult:
        """
        Run a single what-if scenario.

        Args:
            base_features: The current feature vector (dict of feature → value).
            modifications: Changes to apply. If as_delta=True, values are added
                           to the base; if False, they replace the base value.
            scenario_name: Human-readable scenario label.
            as_delta: If True, modification values are relative (e.g., +5 m/s).
                      If False, they are absolute replacements.

        Returns:
            ScenarioResult with both predictions and the delta.
        """
        import pandas as pd

        feature_names = list(base_features.keys())
        base_values = [base_features.get(f, 0.0) for f in feature_names]

        # Build base input
        base_row = pd.DataFrame([base_values], columns=feature_names)
        base_pred = float(self.model.predict(base_row)[0])

        # Build modified input
        modified = copy.deepcopy(base_features)
        applied_mods = {}
        for feature, value in modifications.items():
            if feature in modified:
                if as_delta:
                    modified[feature] = modified[feature] + value
                    applied_mods[feature] = f"{'+' if value >= 0 else ''}{value}"
                else:
                    old = modified[feature]
                    modified[feature] = value
                    applied_mods[feature] = f"{old} → {value}"
            else:
                logger.warning(f"[Simulator] Feature '{feature}' not in base vector. Skipping.")

        mod_values = [modified.get(f, 0.0) for f in feature_names]
        mod_row = pd.DataFrame([mod_values], columns=feature_names)
        mod_pred = float(self.model.predict(mod_row)[0])

        delta = mod_pred - base_pred
        delta_pct = (delta / base_pred * 100) if base_pred != 0 else 0.0

        interpretation = self._interpret(delta, delta_pct)

        logger.info(
            f"[Simulator] {scenario_name}: "
            f"Base={base_pred:.1f}, Modified={mod_pred:.1f}, "
            f"Δ={delta:+.1f} ({delta_pct:+.1f}%)"
        )

        return ScenarioResult(
            scenario_name=scenario_name,
            base_prediction=round(base_pred, 1),
            modified_prediction=round(mod_pred, 1),
            delta=round(delta, 1),
            delta_pct=round(delta_pct, 1),
            modifications=applied_mods,
            interpretation=interpretation,
        )

    def batch_run(self,
                  base_features: dict[str, float],
                  scenarios: dict[str, dict[str, float]]) -> list[ScenarioResult]:
        """
        Run multiple what-if scenarios and return ranked results.

        Args:
            base_features: Current feature vector.
            scenarios: Dict of {scenario_name: {feature: delta_value}}.
        """
        results = []
        for name, mods in scenarios.items():
            results.append(self.run(base_features, mods, scenario_name=name))
        # Sort by improvement (most negative delta = best air quality improvement)
        results.sort(key=lambda r: r.delta)
        return results

    @staticmethod
    def _interpret(delta: float, delta_pct: float) -> str:
        if delta < -20:
            return f"Significant improvement: AQI could decrease by {abs(delta):.1f} points ({abs(delta_pct):.1f}%)."
        elif delta < -5:
            return f"Moderate improvement: AQI could decrease by {abs(delta):.1f} points."
        elif delta < 5:
            return "Minimal impact: This change is unlikely to meaningfully alter AQI."
        elif delta < 20:
            return f"Moderate worsening: AQI could increase by {delta:.1f} points."
        else:
            return f"Significant worsening: AQI could increase by {delta:.1f} points ({delta_pct:.1f}%). Consider preventive action."
