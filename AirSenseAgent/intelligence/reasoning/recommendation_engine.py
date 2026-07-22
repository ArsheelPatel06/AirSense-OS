"""
Recommendation Engine.

Generates stakeholder-personalized recommendations based on:
  - Current AQI level and CPCB category
  - Root cause (from CausalEngine)
  - Forecast trend

Stakeholders: Citizen, Hospital, Government, Industry

Usage:
    from intelligence.reasoning.recommendation_engine import RecommendationEngine

    engine = RecommendationEngine()
    recs = engine.get_recommendations(aqi=320, cause="Crop Burning", stakeholder="citizen")
"""
from __future__ import annotations

import logging
from dataclasses import dataclass

from intelligence.policy.cpcb_rules import classify_aqi

logger = logging.getLogger(__name__)

STAKEHOLDERS = {"citizen", "hospital", "government", "industry"}


@dataclass
class Recommendation:
    stakeholder: str
    aqi_category: str
    priority: str           # "low", "medium", "high", "critical"
    actions: list[str]
    cause_specific: list[str]


class RecommendationEngine:
    """Generates contextual, stakeholder-specific recommendations."""

    def get_recommendations(self,
                            aqi: int,
                            cause: str = "",
                            trend: str = "stable",       # "improving", "stable", "deteriorating"
                            stakeholder: str = "citizen") -> Recommendation:
        """
        Args:
            aqi: Current or forecast AQI value.
            cause: Top causal hypothesis (e.g., "Crop Burning").
            trend: Forecast trajectory.
            stakeholder: One of citizen / hospital / government / industry.

        Returns:
            Recommendation with prioritized action list.
        """
        stakeholder = stakeholder.lower()
        if stakeholder not in STAKEHOLDERS:
            raise ValueError(f"Unknown stakeholder '{stakeholder}'. Choose from: {STAKEHOLDERS}")

        category = classify_aqi(aqi)
        priority = self._get_priority(aqi, trend)

        base_actions = self._base_actions(aqi, category.name, stakeholder)
        cause_specific = self._cause_specific_actions(cause, stakeholder)

        return Recommendation(
            stakeholder=stakeholder,
            aqi_category=category.name,
            priority=priority,
            actions=base_actions,
            cause_specific=cause_specific,
        )

    @staticmethod
    def _get_priority(aqi: int, trend: str) -> str:
        if aqi > 400 or (aqi > 300 and trend == "deteriorating"):
            return "critical"
        if aqi > 300 or (aqi > 200 and trend == "deteriorating"):
            return "high"
        if aqi > 200 or (aqi > 100 and trend == "deteriorating"):
            return "medium"
        return "low"

    @staticmethod
    def _base_actions(aqi: int, category: str, stakeholder: str) -> list[str]:
        actions_map = {
            "citizen": {
                "Good":         ["Air quality is healthy. Enjoy outdoor activities."],
                "Satisfactory": ["Sensitive individuals should monitor AQI before outdoor exercise."],
                "Moderate":     ["Wear a surgical mask outdoors.", "Limit prolonged outdoor exertion."],
                "Poor":         ["Wear N95 mask outdoors.", "Avoid outdoor exercise.", "Keep windows closed.", "Run HEPA air purifier indoors."],
                "Very Poor":    ["Avoid all outdoor activities.", "N95 is mandatory if outdoors.", "HEPA purifier essential indoors.", "Consult doctor if you feel chest tightness."],
                "Severe":       ["Stay strictly indoors.", "N95 + goggles if outdoor exposure unavoidable.", "Seek medical help if experiencing respiratory distress.", "Children and elderly must not leave home."],
            },
            "hospital": {
                "Good":         ["Routine operations. No additional measures needed."],
                "Satisfactory": ["Monitor OPD respiratory case load."],
                "Moderate":     ["Increase respiratory ward readiness by 10%.", "Brief staff on AQI advisory."],
                "Poor":         ["Prepare for 20–30% increase in respiratory admissions.", "Ensure nebulizers and oxygen reserves are stocked.", "Brief emergency department on incoming cases."],
                "Very Poor":    ["Activate respiratory emergency protocol.", "Open additional beds in pulmonology.", "Alert ICU for potential acute admissions.", "Issue hospital staff N95 mask advisory."],
                "Severe":       ["Declare respiratory surge protocol.", "Coordinate with district health office.", "Postpone non-essential surgeries to free capacity.", "Request additional oxygen cylinder supply."],
            },
            "government": {
                "Good":         ["No action required. Continue routine monitoring."],
                "Satisfactory": ["Publish daily AQI bulletin. Monitor industrial sources."],
                "Moderate":     ["Issue public advisory.", "Increase mobile monitoring in hotspot areas."],
                "Poor":         ["Trigger GRAP Stage I.", "Restrict construction dust.", "Deploy water sprinklers on major roads.", "Issue advisory to reduce private vehicle use."],
                "Very Poor":    ["Trigger GRAP Stage II.", "Close schools and colleges.", "Implement odd-even vehicle scheme.", "Halt C&D activities.", "Restrict diesel generator use."],
                "Severe":       ["Trigger GRAP Stage III/IV.", "Emergency public health order.", "Coordinate with central government.", "Consider partial industrial shutdown.", "Mass public communication via all channels."],
            },
            "industry": {
                "Good":         ["Normal operations. Maintain emission standards."],
                "Satisfactory": ["Review emission logs. Ensure compliance with NAAQS."],
                "Moderate":     ["Reduce open burning. Inspect stack emissions.", "Schedule high-emission activities for low-AQI nights."],
                "Poor":         ["Reduce production intensity where possible.", "Halt all open burning and waste incineration.", "Activate emission control systems at maximum capacity."],
                "Very Poor":    ["Implement emergency emission reduction plan.", "Defer high-emission batch processes.", "Report compliance status to CPCB."],
                "Severe":       ["Halt non-essential production lines.", "Coordinate with CPCB for emergency compliance waiver if needed.", "Full stack monitoring every 2 hours."],
            },
        }
        return actions_map.get(stakeholder, {}).get(category, [])

    @staticmethod
    def _cause_specific_actions(cause: str, stakeholder: str) -> list[str]:
        cause_lower = cause.lower()
        actions = []

        if "crop" in cause_lower or "burning" in cause_lower:
            if stakeholder == "government":
                actions += ["Contact Punjab/Haryana state governments to intensify stubble burning enforcement.", "Deploy satellite fire count alerts to district collectors."]
            elif stakeholder == "citizen":
                actions += ["Smoke from crop fires can travel hundreds of kilometres — N95 is especially important today."]

        elif "dust" in cause_lower or "storm" in cause_lower:
            if stakeholder == "citizen":
                actions += ["Close all windows and doors immediately.", "Dust storms can subside within a few hours — monitor AQI updates."]
            elif stakeholder == "government":
                actions += ["Activate dust storm warning system.", "Issue road safety advisory (reduced visibility)."]

        elif "festival" in cause_lower or "fireworks" in cause_lower:
            if stakeholder == "government":
                actions += ["Consider time restrictions on fireworks use.", "Pre-position hospital resources before festival evening."]
            elif stakeholder == "citizen":
                actions += ["Celebrate indoors where possible.", "Choose eco-friendly fireworks or light diyas instead."]

        elif "traffic" in cause_lower or "vehicle" in cause_lower:
            if stakeholder == "government":
                actions += ["Encourage work-from-home today.", "Deploy traffic police for decongestion at identified chokepoints."]
            elif stakeholder == "citizen":
                actions += ["Use public transport today.", "Avoid routes near congested areas during peak hours."]

        elif "inversion" in cause_lower:
            if stakeholder == "citizen":
                actions += ["Temperature inversions typically ease by mid-morning. Limit early-morning outdoor exposure."]
            elif stakeholder == "government":
                actions += ["Ban open burning until inversion lifts.", "Issue morning advisory for vulnerable populations."]

        return actions
