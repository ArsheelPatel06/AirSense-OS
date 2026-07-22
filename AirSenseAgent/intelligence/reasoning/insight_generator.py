"""
Autonomous Insight Generator.

Every hour, AirSense generates structured insights automatically —
not just dashboards, but active observations like:

    "Delhi AQI increased 18% overnight. Primary contributors:
     PM2.5, Calm winds, High humidity. Confidence: 92%.
     Not just dashboards, but observations."

This component combines:
  - Digital Twin state (current vs previous)
  - Causal Engine analysis
  - Alert Engine output
  - NLG explanation

Usage:
    from intelligence.reasoning.insight_generator import InsightGenerator
    from intelligence.digital_twin.twin import DigitalTwin
    
    generator = InsightGenerator()
    insight = generator.generate("DL001", twin, features_dict)
"""
from __future__ import annotations

import json
import logging
from dataclasses import dataclass, asdict
from datetime import datetime
from pathlib import Path
from typing import Any

from config.settings import settings
from intelligence.reasoning.causal_engine import CausalEngine
from intelligence.reasoning.alert_engine import AlertEngine
from intelligence.reasoning.recommendation_engine import RecommendationEngine
from intelligence.reasoning.nlg import NLGEngine

logger = logging.getLogger(__name__)


@dataclass
class Insight:
    station_id: str
    city: str
    generated_at: str
    aqi_current: int
    aqi_previous: int | None
    change_pct: float | None
    alert_level: str
    top_cause: str
    cause_confidence_pct: float
    contributing_conditions: list[str]
    citizen_recommendations: list[str]
    government_recommendations: list[str]
    natural_language_summary: str


class InsightGenerator:
    """Combines reasoning engines to generate hourly structured insights."""

    def __init__(self, insight_dir: str | Path | None = None):
        self.causal_engine = CausalEngine()
        self.alert_engine = AlertEngine()
        self.rec_engine = RecommendationEngine()
        self.nlg = NLGEngine()
        self.insight_dir = Path(insight_dir or (settings.lake_path / "insights"))
        self.insight_dir.mkdir(parents=True, exist_ok=True)

    def generate(self,
                 station_id: str,
                 city: str,
                 aqi_current: int,
                 features: dict[str, Any],
                 aqi_previous: int | None = None,
                 forecast_24h: float | None = None,
                 forecast_confidence: float = 80.0,
                 trend: str = "stable",
                 month: int | None = None) -> Insight:
        """
        Generate a structured insight for a station at a point in time.

        Args:
            station_id: CPCB station code.
            city: Station city name.
            aqi_current: Current observed AQI.
            features: Full feature dict (from FeatureVector.to_dict()).
            aqi_previous: Previous AQI reading for change calculation.
            forecast_24h: 24-hour AQI forecast.
            forecast_confidence: Model confidence for forecast (0–100).
            trend: "improving", "stable", or "deteriorating".
            month: Current calendar month (auto-detected if None).
        """
        now = datetime.utcnow()
        month = month or now.month

        # ── Causal analysis ───────────────────────────────────────────────────
        causal_result = self.causal_engine.analyze(features, month=month, city=city)

        # ── Alert evaluation ──────────────────────────────────────────────────
        alert = self.alert_engine.evaluate(
            aqi_current=aqi_current,
            aqi_forecast_24h=forecast_24h,
            confidence_pct=forecast_confidence,
            trend=trend,
        )

        # ── Recommendations ───────────────────────────────────────────────────
        citizen_rec = self.rec_engine.get_recommendations(
            aqi=aqi_current, cause=causal_result.top_cause,
            trend=trend, stakeholder="citizen"
        )
        gov_rec = self.rec_engine.get_recommendations(
            aqi=aqi_current, cause=causal_result.top_cause,
            trend=trend, stakeholder="government"
        )

        # ── Change calculation ────────────────────────────────────────────────
        change_pct = None
        if aqi_previous and aqi_previous > 0:
            change_pct = round(((aqi_current - aqi_previous) / aqi_previous) * 100, 1)

        # ── Top pollutant from features ───────────────────────────────────────
        pollutant_keys = ["pm25", "pm10", "no2", "so2", "o3", "co"]
        pollutant_vals = {k: features.get(k, 0.0) or 0.0 for k in pollutant_keys}
        top_pollutant = max(pollutant_vals, key=pollutant_vals.get).upper()

        # ── NLG summary ───────────────────────────────────────────────────────
        summary = self.nlg.explain(
            aqi=aqi_current,
            category=alert.title.split(":")[1].strip().split("(")[0].strip() if ":" in alert.title else "Unknown",
            trend=trend,
            forecast_24h=forecast_24h,
            confidence_pct=forecast_confidence,
            cause=causal_result.top_cause,
            top_pollutant=top_pollutant,
            contributing_conditions=causal_result.contributing_conditions,
            recommendations=citizen_rec.actions,
            city=city,
        )

        insight = Insight(
            station_id=station_id,
            city=city,
            generated_at=now.isoformat(),
            aqi_current=aqi_current,
            aqi_previous=aqi_previous,
            change_pct=change_pct,
            alert_level=alert.level,
            top_cause=causal_result.top_cause,
            cause_confidence_pct=causal_result.top_confidence_pct,
            contributing_conditions=causal_result.contributing_conditions,
            citizen_recommendations=citizen_rec.actions[:3],
            government_recommendations=gov_rec.actions[:3],
            natural_language_summary=summary,
        )

        # ── Persist insight ───────────────────────────────────────────────────
        date_str = now.strftime("%Y-%m-%d")
        insight_path = self.insight_dir / f"{station_id}_{date_str}.jsonl"
        with open(insight_path, "a") as f:
            f.write(json.dumps(asdict(insight)) + "\n")

        logger.info(f"[InsightGenerator] Insight generated for {station_id} (AQI={aqi_current}, Cause={causal_result.top_cause})")
        return insight
