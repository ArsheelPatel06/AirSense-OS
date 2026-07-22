"""
AirSense Orchestrator.

Central coordinator for the full ingestion pipeline.

Flow:
    Providers → Connectors → Raw Lake → Quality → Provenance
    → Processed Lake → Feature Builder → Feature Store

Rules enforced by the orchestrator:
  1. Connectors always run via their .run() method — never called directly.
  2. Feature Builder is invoked AFTER processed lake is written.
  3. The orchestrator tracks every run in an execution log.
  4. Any connector failure is isolated — it does NOT abort the full pipeline.

Usage:
    orch = Orchestrator(lake_root="data/lake")
    orch.register(CPCBConnector(...))
    orch.register(IMDConnector(...))
    results = orch.run_all()

    # Or run a single connector by name:
    result = orch.run_one("cpcb")
"""
from __future__ import annotations

import json
import logging
import traceback
from dataclasses import asdict, dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)


@dataclass
class RunRecord:
    """Execution record for a single connector run."""
    connector_id: str
    status: str                 # SUCCESS | FAILED | SKIPPED
    started_at: str
    finished_at: str = ""
    rows_raw: int = 0
    rows_processed: int = 0
    quality_score: float = 0.0
    raw_lake_path: str = ""
    processed_lake_path: str = ""
    error: str = ""


@dataclass
class OrchestratorReport:
    """Full report for a single orchestrator run."""
    run_id: str
    started_at: str
    finished_at: str = ""
    total: int = 0
    succeeded: int = 0
    failed: int = 0
    skipped: int = 0
    records: list[RunRecord] = field(default_factory=list)


class Orchestrator:
    """
    Central pipeline orchestrator for AirSense data ingestion.

    Responsibilities:
      - Manage connector registry
      - Execute connectors in declared order (or in parallel in future)
      - Enforce lake immutability by never touching raw files after write
      - Produce a JSON execution log for every run
      - Isolate connector failures (one bad connector ≠ full pipeline down)
    """

    def __init__(self, lake_root: str | Path = "data/lake",
                 log_dir: str | Path = "data/etl/logs"):
        self._lake_root = Path(lake_root)
        self._log_dir = Path(log_dir)
        self._log_dir.mkdir(parents=True, exist_ok=True)
        self._connectors: dict[str, Any] = {}   # connector_id → BaseConnector

    # ------------------------------------------------------------------
    # Registry
    # ------------------------------------------------------------------

    def register(self, connector: Any) -> "Orchestrator":
        """
        Register a connector with the orchestrator.

        Args:
            connector: Any BaseConnector instance.

        Returns self for fluent chaining:
            orch.register(cpcb).register(imd).run_all()
        """
        cid = connector.connector_id
        if cid in self._connectors:
            logger.warning(f"[Orchestrator] Overwriting existing connector '{cid}'.")
        self._connectors[cid] = connector
        logger.info(f"[Orchestrator] Registered connector: {cid}")
        return self

    # ------------------------------------------------------------------
    # Execution
    # ------------------------------------------------------------------

    def run_all(self, **fetch_kwargs) -> OrchestratorReport:
        """
        Run all registered connectors sequentially.

        A failure in one connector is logged and execution continues.

        Returns:
            OrchestratorReport with per-connector RunRecords.
        """
        run_id = datetime.utcnow().strftime("run_%Y%m%dT%H%M%SZ")
        report = OrchestratorReport(
            run_id=run_id,
            started_at=datetime.utcnow().isoformat(),
            total=len(self._connectors),
        )

        logger.info(f"[Orchestrator] Starting {run_id} — {len(self._connectors)} connector(s).")

        for cid, connector in self._connectors.items():
            record = self._execute_connector(connector, fetch_kwargs)
            report.records.append(record)
            if record.status == "SUCCESS":
                report.succeeded += 1
            elif record.status == "FAILED":
                report.failed += 1
            else:
                report.skipped += 1

        report.finished_at = datetime.utcnow().isoformat()
        self._write_execution_log(run_id, report)

        logger.info(
            f"[Orchestrator] {run_id} done — "
            f"✓ {report.succeeded}  ✗ {report.failed}  ⊘ {report.skipped}"
        )
        return report

    def run_one(self, connector_id: str, **fetch_kwargs) -> RunRecord:
        """Run a single registered connector by ID."""
        if connector_id not in self._connectors:
            raise KeyError(f"Connector '{connector_id}' is not registered.")
        record = self._execute_connector(self._connectors[connector_id], fetch_kwargs)
        logger.info(f"[Orchestrator] {connector_id} → {record.status}")
        return record

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _execute_connector(self, connector: Any, fetch_kwargs: dict) -> RunRecord:
        cid = connector.connector_id
        record = RunRecord(
            connector_id=cid,
            status="SKIPPED",
            started_at=datetime.utcnow().isoformat(),
        )

        try:
            logger.info(f"[Orchestrator] → Running {cid}")
            result = connector.run(**fetch_kwargs)

            record.status = "SUCCESS"
            record.rows_raw = result.rows_raw
            record.rows_processed = result.rows_processed
            record.quality_score = result.quality_score
            record.raw_lake_path = result.raw_lake_path
            record.processed_lake_path = result.processed_lake_path
            record.finished_at = datetime.utcnow().isoformat()

            logger.info(
                f"[Orchestrator] ✓ {cid} — "
                f"{result.rows_processed} rows processed, quality={result.quality_score:.1f}"
            )

        except Exception as exc:
            record.status = "FAILED"
            record.error = str(exc)
            record.finished_at = datetime.utcnow().isoformat()
            logger.error(
                f"[Orchestrator] ✗ {cid} FAILED: {exc}\n{traceback.format_exc()}"
            )
            # Do NOT re-raise — isolate the failure.

        return record

    def _write_execution_log(self, run_id: str, report: OrchestratorReport) -> Path:
        """Persist the full orchestrator report as a JSON execution log."""
        path = self._log_dir / f"{run_id}.json"
        path.write_text(
            json.dumps(asdict(report), indent=2, default=str),
            encoding="utf-8",
        )
        logger.debug(f"[Orchestrator] Execution log → {path}")
        return path

    # ------------------------------------------------------------------
    # Introspection
    # ------------------------------------------------------------------

    def list_connectors(self) -> list[str]:
        """Return IDs of all registered connectors."""
        return list(self._connectors.keys())

    def __repr__(self) -> str:
        return f"<Orchestrator connectors={self.list_connectors()}>"
