"""
Daily Scheduler — historical sync.

Cadence:
    Daily → sync last 24h of CPCB observations for all registered stations
           → rebuild processed lake
           → run AQI cross-validation batch report
           → update Feature Store

Run standalone:
    python scheduler/daily.py

Or call from cron:
    0 2 * * * cd /path/to/AirSenseAgent && python3 scheduler/daily.py
"""
from __future__ import annotations

import logging
from datetime import datetime, timedelta
from pathlib import Path

logger = logging.getLogger(__name__)


class DailyScheduler:
    """
    Runs daily historical sync for all states in the archive.

    Pipeline:
        CSVProvider (archive) → CPCBConnector → AQI batch validation
    """

    # State codes available in archive (from stations_info.csv)
    STATE_CODES = [
        "DL", "MH", "UP", "HR", "RJ", "KA", "TN", "WB",
        "GJ", "MP", "BR", "TG", "AP", "PB", "OR", "KL",
    ]

    def __init__(self, archive_path: str | Path = "gov_data/archive",
                 lake_root: str | Path = "data/lake"):
        self._archive = Path(archive_path)
        self._lake_root = Path(lake_root)

    def run(self) -> None:
        """Execute the full daily sync."""
        from data.providers.cpcb import CSVProvider
        from data.connectors.cpcb_connector import CPCBConnector
        from data.etl.orchestrator import Orchestrator

        start = datetime.utcnow()
        logger.info(f"[Daily] Starting daily sync at {start.isoformat()}")

        orch = Orchestrator(lake_root=self._lake_root)

        # Register a connector per state (first station file per state)
        for code in self.STATE_CODES:
            station_file = self._archive / f"{code}001.csv"
            if not station_file.exists():
                logger.warning(f"[Daily] {code}001.csv not found — skipping")
                continue

            class _Connector(CPCBConnector):
                _code = code
                def __init__(self, provider, lake_root):
                    super().__init__(provider=provider, lake_root=lake_root)
                    self.connector_id = f"cpcb_{self._code.lower()}"
                def run(self, **_):
                    return super().run(file_code=f"{self._code}001")

            provider = CSVProvider(lake_archive_path=self._archive)
            orch.register(_Connector(provider=provider, lake_root=self._lake_root))

        report = orch.run_all()
        elapsed = (datetime.utcnow() - start).total_seconds()
        logger.info(
            f"[Daily] Sync complete in {elapsed:.0f}s — "
            f"✓{report.succeeded} / ✗{report.failed} / ⊘{report.skipped}"
        )


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s %(levelname)-8s %(message)s")
    DailyScheduler().run()
