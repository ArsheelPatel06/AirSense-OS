"""
Refactored BaseConnector.

Connectors sit between Providers and the Data Lake.
They enforce the full ETL lifecycle and are the ONLY components
that write to the lake. They never write to the Feature Store.

Full Lifecycle:
    connect() -> authenticate() -> fetch() -> cache() -> parse() ->
    validate() -> normalize() -> quality() -> register() ->
    store_raw() -> store_processed() -> metadata() -> close()
"""
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any
import hashlib
import json
import logging

logger = logging.getLogger(__name__)


@dataclass
class ConnectorResult:
    """Output contract from every connector run."""
    connector: str
    provider_used: str
    raw_lake_path: str
    processed_lake_path: str
    rows_raw: int
    rows_processed: int
    quality_score: float
    provenance_path: str
    run_time_utc: str = field(default_factory=lambda: datetime.utcnow().isoformat())
    warnings: list[str] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)


class BaseConnector(ABC):
    """
    Abstract base for all AirSense data connectors.

    A connector consumes exactly ONE provider and is responsible for
    the full journey from raw fetch to processed lake storage.

    Critical rules:
      1. Never write to the Feature Store directly.
      2. Never modify files in data/lake/raw/ after initial write.
      3. Always produce a provenance sidecar JSON alongside every lake file.
    """

    def __init__(self, connector_id: str, provider: Any, lake_root: Path | str = "data/lake"):
        self.connector_id = connector_id
        self.provider = provider
        self.lake_root = Path(lake_root)
        self._raw_payload: Any = None
        self._parsed_data: list[dict] = []
        self._processed_data: list[dict] = []
        self._quality_score: float = 0.0
        self._result: ConnectorResult | None = None

    # ------------------------------------------------------------------
    # Public entry point — runs the full lifecycle
    # ------------------------------------------------------------------

    def run(self, **fetch_kwargs) -> ConnectorResult:
        """Execute the full connector lifecycle. Returns a ConnectorResult."""
        logger.info(f"[{self.connector_id}] Starting run via {self.provider.name}")
        try:
            with self.provider as p:
                # 1. Fetch
                self._raw_payload = p.fetch(**fetch_kwargs)
                provider_meta = p.metadata()
                logger.info(f"[{self.connector_id}] Fetched {provider_meta.rows} rows")

                # 2. Cache  (store raw immediately — never lose data)
                raw_path = self._store_raw(self._raw_payload, provider_meta)

                # 3–4. Parse & Validate
                self._parsed_data = self.parse(self._raw_payload)
                if not self.validate(self._parsed_data):
                    raise ValueError(f"[{self.connector_id}] Validation failed — aborting.")

                # 5. Normalize
                self._processed_data = self.normalize(self._parsed_data)

                # 6. Quality
                self._quality_score = self.quality(self._processed_data)
                logger.info(f"[{self.connector_id}] Quality score: {self._quality_score:.1f}")

                # 7. Provenance
                prov_path = self._register_provenance(provider_meta, raw_path)

                # 8. Store processed
                proc_path = self._store_processed(self._processed_data)

            self._result = ConnectorResult(
                connector=self.connector_id,
                provider_used=self.provider.name,
                raw_lake_path=str(raw_path),
                processed_lake_path=str(proc_path),
                rows_raw=len(self._parsed_data),
                rows_processed=len(self._processed_data),
                quality_score=self._quality_score,
                provenance_path=str(prov_path),
            )
        except Exception as exc:
            logger.error(f"[{self.connector_id}] FAILED: {exc}")
            raise

        logger.info(f"[{self.connector_id}] Run complete. Result: {self._result}")
        return self._result

    # ------------------------------------------------------------------
    # Abstract steps  (connectors must implement these)
    # ------------------------------------------------------------------

    @abstractmethod
    def parse(self, raw: Any) -> list[dict]:
        """Parse the raw provider payload into a list of record dicts."""
        ...

    @abstractmethod
    def validate(self, records: list[dict]) -> bool:
        """
        Validate parsed records against the data contract.
        Return True to continue, False to abort and raise.
        """
        ...

    @abstractmethod
    def normalize(self, records: list[dict]) -> list[dict]:
        """
        Apply column renaming, unit conversion, type coercion.
        Must return records that match the canonical schema.
        """
        ...

    @abstractmethod
    def quality(self, records: list[dict]) -> float:
        """
        Compute a quality score in [0.0, 100.0].
        Score factors: completeness, range checks, outlier rate.
        """
        ...

    # ------------------------------------------------------------------
    # Internal lake I/O  (not overridable)
    # ------------------------------------------------------------------

    def _store_raw(self, payload: Any, meta: Any) -> Path:
        """Write raw payload to the immutable raw lake. Never call again for the same run."""
        raw_dir = self.lake_root / "raw" / self.connector_id
        raw_dir.mkdir(parents=True, exist_ok=True)
        ts = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
        path = raw_dir / f"{ts}.json"
        path.write_text(json.dumps(payload, default=str, indent=2), encoding="utf-8")
        logger.debug(f"[{self.connector_id}] Raw written → {path}")
        return path

    def _store_processed(self, records: list[dict]) -> Path:
        """Write normalized records to the processed lake."""
        proc_dir = self.lake_root / "processed" / self.connector_id
        proc_dir.mkdir(parents=True, exist_ok=True)
        ts = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
        path = proc_dir / f"{ts}.json"
        path.write_text(json.dumps(records, default=str, indent=2), encoding="utf-8")
        logger.debug(f"[{self.connector_id}] Processed written → {path}")
        return path

    def _register_provenance(self, meta: Any, raw_path: Path) -> Path:
        """Create a sidecar provenance JSON next to the raw file."""
        prov = {
            "connector": self.connector_id,
            "provider": meta.provider,
            "dataset": meta.dataset,
            "download_time": meta.download_time,
            "rows": meta.rows,
            "checksum": meta.checksum,
            "quality": meta.quality,
            "source_url": meta.source_url,
            "raw_path": str(raw_path),
        }
        prov_path = raw_path.with_suffix(".provenance.json")
        prov_path.write_text(json.dumps(prov, indent=2), encoding="utf-8")
        return prov_path
