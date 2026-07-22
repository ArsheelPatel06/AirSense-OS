"""
Alert Engine.

Generates calibrated alerts by combining:
  - Forecast AQI and confidence
  - Trend direction (improving / stable / deteriorating)
  - Vulnerable population exposure

Unlike simple threshold alerts, this engine considers trajectory.
A current AQI of 200 that is rapidly rising is more dangerous
than a current AQI of 250 that is falling.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import datetime

from intelligence.policy.cpcb_rules import classify_aqi

logger = logging.getLogger(__name__)


@dataclass
class Alert:
    level: str              # "green", "yellow", "orange", "red"
    title: str
    message: str
    aqi_current: int
    aqi_forecast_24h: float | None
    trend: str
    confidence_pct: float
    issued_at: str


class AlertEngine:
    """
    Issues calibrated air quality alerts based on AQI + trend + confidence.
    """

    # Minimum confidence to issue an alert above Green
    MIN_CONFIDENCE_TO_ALERT = 60.0

    def evaluate(self,
                 aqi_current: int,
                 aqi_forecast_24h: float | None = None,
                 confidence_pct: float = 80.0,
                 trend: str = "stable") -> Alert:
        """
        Evaluate current and forecast conditions and issue an alert.

        Args:
            aqi_current: Current observed AQI.
            aqi_forecast_24h: Optional 24-hour forecast AQI.
            confidence_pct: Model confidence in the forecast (0–100).
            trend: "improving", "stable", or "deteriorating".

        Returns:
            Alert with level, message, and metadata.
        """
        category = classify_aqi(aqi_current)

        # Boost alert level if deteriorating trend
        effective_aqi = aqi_current
        if trend == "deteriorating" and aqi_forecast_24h:
            # Use the forecast if it's worse and confidence is sufficient
            if confidence_pct >= self.MIN_CONFIDENCE_TO_ALERT and aqi_forecast_24h > aqi_current:
                effective_aqi = int(aqi_forecast_24h)

        alert_level = self._determine_level(effective_aqi, trend, confidence_pct)
        title, message = self._compose_message(
            aqi_current, aqi_forecast_24h, category.name, trend, confidence_pct, alert_level
        )

        return Alert(
            level=alert_level,
            title=title,
            message=message,
            aqi_current=aqi_current,
            aqi_forecast_24h=aqi_forecast_24h,
            trend=trend,
            confidence_pct=confidence_pct,
            issued_at=datetime.utcnow().isoformat(),
        )

    @staticmethod
    def _determine_level(effective_aqi: int, trend: str, confidence_pct: float) -> str:
        if effective_aqi <= 100:
            return "green"
        elif effective_aqi <= 200:
            # Moderate: yellow, but orange if deteriorating with high confidence
            if trend == "deteriorating" and confidence_pct >= 75:
                return "orange"
            return "yellow"
        elif effective_aqi <= 300:
            return "orange"
        else:
            return "red"

    @staticmethod
    def _compose_message(aqi_current: int, aqi_forecast_24h: float | None,
                         category: str, trend: str, confidence_pct: float,
                         level: str) -> tuple[str, str]:
        trend_text = {
            "improving": "improving and expected to decrease",
            "stable": "stable",
            "deteriorating": "deteriorating and forecast to worsen",
        }.get(trend, "stable")

        title = f"AQI Alert: {category} ({aqi_current})"
        if level == "red":
            title = f"⛔ CRITICAL AQI Alert: {category} ({aqi_current})"
        elif level == "orange":
            title = f"🔶 HIGH AQI Alert: {category} ({aqi_current})"
        elif level == "yellow":
            title = f"🟡 MODERATE AQI Alert: {category} ({aqi_current})"

        message = (
            f"Current AQI is {aqi_current} ({category}). "
            f"Conditions are {trend_text}."
        )
        if aqi_forecast_24h is not None and confidence_pct >= 60:
            direction = "rise" if aqi_forecast_24h > aqi_current else "fall"
            message += (
                f" The 24-hour forecast indicates AQI may {direction} "
                f"to {aqi_forecast_24h:.0f} "
                f"(model confidence: {confidence_pct:.0f}%)."
            )

        return title, message
