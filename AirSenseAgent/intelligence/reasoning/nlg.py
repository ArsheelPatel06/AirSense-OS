"""
Natural Language Generation (NLG) Engine.

Converts structured prediction + reasoning outputs into clear,
human-readable English paragraphs.

No LLM dependency — template-driven for auditability, speed, and
offline operation. Every explanation references real data, causes,
and recommendations.

Usage:
    from intelligence.reasoning.nlg import NLGEngine

    engine = NLGEngine()
    text = engine.explain(
        aqi=184,
        category="Poor",
        trend="deteriorating",
        forecast_24h=210,
        confidence_pct=82,
        cause="Temperature Inversion",
        top_pollutant="PM2.5",
        contributing_conditions=["Weak winds", "High humidity"],
        recommendations=["Wear N95 mask", "Avoid outdoor exercise"],
    )
    print(text)
"""
from __future__ import annotations

import logging
import random

logger = logging.getLogger(__name__)


class NLGEngine:
    """Template-driven natural language explanation generator."""

    def explain(self,
                aqi: int,
                category: str,
                trend: str = "stable",
                forecast_24h: float | None = None,
                confidence_pct: float = 80.0,
                cause: str = "",
                top_pollutant: str = "PM2.5",
                contributing_conditions: list[str] | None = None,
                recommendations: list[str] | None = None,
                city: str = "") -> str:
        """
        Generate a plain-English AQI explanation.

        Returns:
            A 2–4 sentence paragraph suitable for public-facing display.
        """
        parts = []
        location = f"in {city}" if city else ""

        # ── Sentence 1: Current state ─────────────────────────────────────────
        severity_phrase = self._severity_phrase(aqi, category)
        parts.append(
            f"Air quality {location} is currently {severity_phrase}, "
            f"with an AQI of {aqi} ({category})."
        )

        # ── Sentence 2: Trend and forecast ────────────────────────────────────
        if trend == "deteriorating" and forecast_24h and confidence_pct >= 60:
            parts.append(
                f"Conditions are worsening — the 24-hour forecast indicates AQI may "
                f"rise to {forecast_24h:.0f} "
                f"(model confidence: {confidence_pct:.0f}%)."
            )
        elif trend == "improving" and forecast_24h and confidence_pct >= 60:
            parts.append(
                f"Air quality is expected to improve — the 24-hour forecast projects "
                f"AQI falling to {forecast_24h:.0f} "
                f"(model confidence: {confidence_pct:.0f}%)."
            )
        elif trend == "stable":
            parts.append("Conditions are expected to remain stable over the next 24 hours.")

        # ── Sentence 3: Cause and contributing factors ────────────────────────
        cond_list = contributing_conditions or []
        if cause and cause not in ("Unknown", ""):
            cond_str = (
                (", ".join(cond_list[:2]) + ",") if cond_list
                else "local emission patterns,"
            )
            parts.append(
                f"The primary driver appears to be {cause.lower()}, "
                f"compounded by {cond_str} "
                f"which are limiting pollution dispersion."
            )
        elif cond_list:
            cond_str = " and ".join(cond_list[:2])
            parts.append(
                f"The elevated readings are associated with {cond_str}."
            )

        # ── Sentence 4: Dominant pollutant ────────────────────────────────────
        if top_pollutant:
            parts.append(
                f"The dominant pollutant is {top_pollutant}, "
                f"which poses the greatest health risk under current conditions."
            )

        # ── Sentence 5: Key recommendation ───────────────────────────────────
        recs = recommendations or []
        if recs:
            top_rec = recs[0].lower().rstrip(".")
            parts.append(f"It is advised to {top_rec}.")

        return " ".join(parts)

    def generate_insight(self,
                         city: str,
                         aqi_current: int,
                         aqi_previous: int,
                         cause: str,
                         top_pollutants: list[str],
                         confidence_pct: float) -> str:
        """
        Generate a short autonomous insight (e.g., for hourly bulletin).

        Example output:
            Delhi AQI increased 18% overnight. Primary contributors: PM2.5,
            Calm winds, High humidity. Confidence: 92%.
        """
        if aqi_previous > 0:
            change_pct = ((aqi_current - aqi_previous) / aqi_previous) * 100
            direction = "increased" if change_pct > 0 else "decreased"
            change_str = f"AQI {direction} {abs(change_pct):.0f}% since last reading."
        else:
            change_str = f"Current AQI: {aqi_current}."

        pollutant_str = ", ".join(top_pollutants[:3]) if top_pollutants else "PM2.5"
        cause_str = f" Primary driver: {cause}." if cause and cause != "Unknown" else ""

        return (
            f"{city} {change_str}{cause_str} "
            f"Key contributors: {pollutant_str}. "
            f"Confidence: {confidence_pct:.0f}%."
        )

    @staticmethod
    def _severity_phrase(aqi: int, category: str) -> str:
        phrases = {
            "Good":         ["satisfactory", "good", "healthy"],
            "Satisfactory": ["satisfactory", "acceptable"],
            "Moderate":     ["moderate", "fair"],
            "Poor":         ["poor", "unhealthy for sensitive groups"],
            "Very Poor":    ["very poor", "unhealthy"],
            "Severe":       ["severe", "hazardous", "at emergency levels"],
        }
        options = phrases.get(category, [category.lower()])
        return random.choice(options)
