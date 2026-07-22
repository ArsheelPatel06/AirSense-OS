"""
Dataset Snapshot Manager.

Provides immutable training datasets for the ML Pipeline.
Never train directly from the live Feature Store.
Instead, read FeatureVectors, generate a Snapshot, and train on the Snapshot.

Every model in the registry will permanently link to its exact training snapshot
to guarantee full reproducibility.
"""
from __future__ import annotations

import hashlib
import json
import logging
from dataclasses import asdict
from datetime import datetime
from pathlib import Path

import pandas as pd

from config.settings import settings
from intelligence.feature_builder.feature_vector import FeatureVector

logger = logging.getLogger(__name__)


class DatasetSnapshotManager:
    """Manages immutable ML training datasets."""

    def __init__(self, snapshot_dir: str | Path | None = None):
        if snapshot_dir is None:
            # e.g., data/lake/datasets/snapshots
            self.snapshot_dir = settings.lake_path / "datasets" / "snapshots"
        else:
            self.snapshot_dir = Path(snapshot_dir)
        self.snapshot_dir.mkdir(parents=True, exist_ok=True)

    def create_snapshot(self,
                        name: str,
                        features: list[FeatureVector],
                        description: str = "") -> str:
        """
        Convert a list of FeatureVectors to a Parquet snapshot.

        Args:
            name: Human readable name (e.g., 'summer_2026_delhi')
            features: List of FeatureVectors
            description: Optional context about why this was created

        Returns:
            The snapshot ID (version string).
        """
        if not features:
            raise ValueError("Cannot create a snapshot from an empty list of FeatureVectors.")

        # Timestamp-based versioning ensures immutability
        version = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
        snapshot_id = f"{name}_{version}"
        base_path = self.snapshot_dir / snapshot_id
        base_path.mkdir(exist_ok=True)

        parquet_path = base_path / "data.parquet"
        meta_path = base_path / "metadata.json"

        # 1. Convert to DataFrame
        df = pd.DataFrame([asdict(f) for f in features])
        
        # 2. Save Parquet
        df.to_parquet(parquet_path, index=False)

        # 3. Compute deterministic hash for provenance
        file_hash = hashlib.sha256(parquet_path.read_bytes()).hexdigest()

        # 4. Generate metadata
        meta = {
            "snapshot_id": snapshot_id,
            "name": name,
            "description": description,
            "created_at_utc": datetime.utcnow().isoformat(),
            "rows": len(df),
            "columns": list(df.columns),
            "sha256_hash": file_hash,
            "file_size_bytes": parquet_path.stat().st_size,
        }
        meta_path.write_text(json.dumps(meta, indent=2))

        logger.info(f"[SnapshotManager] Created snapshot {snapshot_id} ({len(df)} rows)")
        return snapshot_id

    def load_snapshot(self, snapshot_id: str) -> pd.DataFrame:
        """Load a snapshot into a Pandas DataFrame."""
        parquet_path = self.snapshot_dir / snapshot_id / "data.parquet"
        if not parquet_path.exists():
            raise FileNotFoundError(f"Snapshot not found: {snapshot_id}")
        return pd.read_parquet(parquet_path)

    def get_metadata(self, snapshot_id: str) -> dict:
        """Retrieve metadata for a given snapshot."""
        meta_path = self.snapshot_dir / snapshot_id / "metadata.json"
        if not meta_path.exists():
            raise FileNotFoundError(f"Snapshot metadata not found: {snapshot_id}")
        return json.loads(meta_path.read_text())

    def list_snapshots(self) -> list[str]:
        """Return all available snapshot IDs."""
        return [d.name for d in self.snapshot_dir.iterdir() if d.is_dir()]
