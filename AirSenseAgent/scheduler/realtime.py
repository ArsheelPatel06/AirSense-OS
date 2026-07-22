"""
Realtime Scheduler — runs every 15 minutes.

Cadence:
    Every 15 minutes → fetch live CPCB + weather → run AQI cross-validation

Run standalone:
    python scheduler/realtime.py

Or import and call:
    from scheduler.realtime import RealtimeScheduler
    sched = RealtimeScheduler()
    sched.start()
"""
from __future__ import annotations

import logging
import signal
import time
from datetime import datetime
from pathlib import Path

logger = logging.getLogger(__name__)

# Default interval (seconds) — 15 minutes
INTERVAL_SECONDS = 15 * 60

# Delhi and Mumbai as initial targets
DEFAULT_LOCATIONS = [
    {"city": "Delhi",  "lat": 28.6139, "lon": 77.2090, "station": "Anand Vihar - DPCC"},
    {"city": "Mumbai", "lat": 19.0760, "lon": 72.8777, "station": "Bandra - MPCB"},
]


class RealtimeScheduler:
    """
    Executes the realtime pipeline on a fixed interval.

    Pipeline per tick:
        1. CPCB Provider Chain → fetch_realtime()
        2. Weather Provider Chain → fetch(lat, lon)
        3. AQI Cross-Validator → validate each station
        4. Store results to lake/processed/realtime/
    """

    def __init__(self, interval: int = INTERVAL_SECONDS,
                 lake_root: str | Path = "data/lake",
                 locations: list[dict] | None = None):
        self._interval = interval
        self._lake_root = Path(lake_root)
        self._locations = locations or DEFAULT_LOCATIONS
        self._running = False

    def start(self, run_once: bool = False) -> None:
        """Start the scheduler. Ctrl+C or SIGTERM to stop cleanly."""
        self._running = True
        signal.signal(signal.SIGTERM, lambda *_: self.stop())

        logger.info(f"[Realtime] Starting — interval={self._interval}s, "
                    f"locations={[l['city'] for l in self._locations]}")

        while self._running:
            self._tick()
            if run_once:
                break
            next_run = datetime.utcnow().isoformat()
            logger.info(f"[Realtime] Sleeping {self._interval}s. Next run ≈ {next_run}")
            time.sleep(self._interval)

    def stop(self) -> None:
        logger.info("[Realtime] Stopping scheduler.")
        self._running = False

    def _tick(self) -> None:
        """Execute one realtime ingestion cycle."""
        from data.providers.cpcb import CPCBProviderChain
        from data.providers.imd import WeatherProviderChain
        from intelligence.feature_builder.aqi_cross_validator import AQICrossValidator

        tick_start = datetime.utcnow()
        logger.info(f"[Realtime] Tick started at {tick_start.isoformat()}")

        cpcb_chain    = CPCBProviderChain.default()
        weather_chain = WeatherProviderChain.default()
        cross_val     = AQICrossValidator(tolerance=5)

        for loc in self._locations:
            try:
                # 1. CPCB
                records = cpcb_chain.fetch_city(city=loc["city"], limit=100)
                logger.info(f"[Realtime] {loc['city']}: {len(records)} CPCB records")

                # 2. Weather
                weather = weather_chain.fetch(lat=loc["lat"], lon=loc["lon"])
                logger.info(f"[Realtime] {loc['city']}: weather fetched "
                            f"(T={weather.get('temperature')}°C)")

                # 3. AQI cross-validation
                for rec in records[:5]:  # Log first 5 only to avoid spam
                    result = cross_val.validate(rec)
                    status = "✓ VERIFIED" if result.verified else "⚠ MISMATCH"
                    logger.info(
                        f"[Realtime] {loc['city']} AQI={result.calculated_aqi} "
                        f"prominent={result.prominent_pollutant} {status}"
                    )

            except Exception as exc:
                logger.error(f"[Realtime] {loc['city']} failed: {exc}")

        elapsed = (datetime.utcnow() - tick_start).total_seconds()
        logger.info(f"[Realtime] Tick complete in {elapsed:.1f}s")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s %(levelname)-8s %(message)s")
    RealtimeScheduler().start()
