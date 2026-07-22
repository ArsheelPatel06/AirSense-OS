"""
Causal Reasoning Engine.

Infers the most likely root cause of an observed AQI condition
by scoring causal hypotheses against the current Feature Vector
and the Environmental Knowledge Base.

Instead of:
    AQI → High

AirSense now infers:
    High PM2.5 + Low Wind + October + NW Wind → Crop Burning (88% confidence)

Usage:
    from intelligence.reasoning.causal_engine import CausalEngine
    
    engine = CausalEngine()
    result = engine.analyze(feature_vector_dict, month=11, city="Delhi")
    print(result.top_cause, result.confidence)
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import datetime

from intelligence.knowledge.events.definitions import EVENT_KNOWLEDGE, EventKnowledge

logger = logging.getLogger(__name__)


@dataclass
class CausalHypothesis:
    event_key: str
    event_name: str
    confidence: float          # 0.0 – 1.0
    evidence: list[str]        # Human-readable supporting evidence
    primary_pollutants: list[str]


@dataclass
class CausalAnalysisResult:
    hypotheses: list[CausalHypothesis]   # Ranked highest confidence first
    top_cause: str
    top_confidence_pct: float
    contributing_conditions: list[str]
    analysis_timestamp: str


class CausalEngine:
    """
    Scores causal hypotheses for an observed pollution state.

    Strategy:
      1. Load all candidate events from the Knowledge Base.
      2. For each event, check how many indicator signals match the current
         Feature Vector (presence of key pollutants, wind direction, season, region).
      3. Normalize scores to produce a ranked list of hypotheses with confidence.
    """

    # How much each type of evidence contributes to the confidence score
    _WEIGHTS = {
        "seasonal_match":        0.30,
        "region_match":          0.20,
        "confidence_boost_feat": 0.35,   # Key pollutant/feature signals
        "wind_match":            0.15,
    }

    def analyze(self,
                features: dict,
                month: int | None = None,
                city: str = "",
                region: str = "") -> CausalAnalysisResult:
        """
        Analyze the current feature vector and return ranked causal hypotheses.

        Args:
            features: dict of {feature_name: value} (from FeatureVector.to_dict())
            month: Calendar month (1–12). Auto-detected from features if None.
            city: Station city for region matching.
            region: Optional broader region string.
        """
        if month is None:
            month = datetime.utcnow().month

        hypotheses = []
        for key, event in EVENT_KNOWLEDGE.items():
            score, evidence = self._score_event(event, features, month, city or region)
            if score > 0.1:    # Ignore implausible hypotheses
                hypotheses.append(CausalHypothesis(
                    event_key=key,
                    event_name=event.name,
                    confidence=round(score, 3),
                    evidence=evidence,
                    primary_pollutants=event.primary_pollutants,
                ))

        hypotheses.sort(key=lambda h: h.confidence, reverse=True)

        top = hypotheses[0] if hypotheses else None
        contributing = self._get_contributing_conditions(features)

        return CausalAnalysisResult(
            hypotheses=hypotheses,
            top_cause=top.event_name if top else "Unknown",
            top_confidence_pct=round(top.confidence * 100, 1) if top else 0.0,
            contributing_conditions=contributing,
            analysis_timestamp=datetime.utcnow().isoformat(),
        )

    def _score_event(self,
                     event: EventKnowledge,
                     features: dict,
                     month: int,
                     location: str) -> tuple[float, list[str]]:
        """Score a single event hypothesis. Returns (score 0–1, evidence list)."""
        score = 0.0
        evidence = []

        # 1. Seasonal match
        if month in event.seasonal_months:
            score += self._WEIGHTS["seasonal_match"]
            evidence.append(f"Month {month} matches {event.name} season.")

        # 2. Region match
        if location:
            for r in event.affected_regions:
                if location.lower() in r.lower() or "all" in r.lower():
                    score += self._WEIGHTS["region_match"]
                    evidence.append(f"Location '{location}' is in affected region '{r}'.")
                    break

        # 3. Confidence-boost features present and above threshold
        boost_matched = 0
        for feat in event.confidence_boost_features:
            val = features.get(feat)
            if val is not None:
                indicator = event.indicators.get(feat, "")
                if self._signal_matches(feat, float(val), indicator):
                    boost_matched += 1
                    evidence.append(f"{feat}={val:.1f} matches indicator: '{indicator}'.")

        if event.confidence_boost_features:
            feat_ratio = boost_matched / len(event.confidence_boost_features)
            score += self._WEIGHTS["confidence_boost_feat"] * feat_ratio

        # 4. Wind direction match (if event specifies a directional pattern)
        wind_dir = features.get("wind_direction")
        wind_ind = event.indicators.get("wind_direction", "")
        if wind_dir is not None and wind_ind:
            if self._wind_matches(float(wind_dir), wind_ind):
                score += self._WEIGHTS["wind_match"]
                evidence.append(f"Wind direction {wind_dir:.0f}° matches '{wind_ind}'.")

        return min(score, 1.0), evidence

    @staticmethod
    def _signal_matches(feature: str, value: float, indicator: str) -> bool:
        """Rough heuristic check: does the observed value match the indicator description?"""
        if "high" in indicator and value > 100:
            return True
        if "very high" in indicator and value > 300:
            return True
        if "elevated" in indicator and value > 50:
            return True
        if "low" in indicator and value < 30:
            return True
        if "very low" in indicator and value < 10:
            return True
        if "moderate" in indicator and 30 <= value <= 150:
            return True
        return False

    @staticmethod
    def _wind_matches(wind_dir: float, indicator: str) -> bool:
        """Check if wind direction matches a directional indicator."""
        indicator = indicator.lower()
        if "northwest" in indicator and 270 <= wind_dir <= 360:
            return True
        if "west" in indicator and 225 <= wind_dir <= 315:
            return True
        if "north" in indicator and (wind_dir >= 315 or wind_dir <= 45):
            return True
        if "east" in indicator and 45 <= wind_dir <= 135:
            return True
        if "south" in indicator and 135 <= wind_dir <= 225:
            return True
        return False

    @staticmethod
    def _get_contributing_conditions(features: dict) -> list[str]:
        """Identify plain-language conditions present in the feature vector."""
        conditions = []
        pm25 = features.get("pm25")
        wind = features.get("wind_speed")
        humidity = features.get("humidity")
        temp = features.get("temperature")

        if pm25 and pm25 > 150:
            conditions.append(f"Very high PM2.5 ({pm25:.1f} µg/m³)")
        elif pm25 and pm25 > 60:
            conditions.append(f"Elevated PM2.5 ({pm25:.1f} µg/m³)")

        if wind is not None and wind < 2:
            conditions.append(f"Near-calm winds ({wind:.1f} m/s) limiting dispersion")
        elif wind is not None and wind < 4:
            conditions.append(f"Weak winds ({wind:.1f} m/s)")

        if humidity is not None and humidity > 70:
            conditions.append(f"High humidity ({humidity:.0f}%) trapping pollutants")

        if temp is not None and temp < 12:
            conditions.append(f"Cold temperature ({temp:.1f}°C) — possible inversion")

        return conditions
