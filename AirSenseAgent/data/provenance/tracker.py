"""Tracks exactly how a dataset or feature was constructed."""
from typing import Dict, Any, List
from datetime import datetime

class ProvenanceTracker:
    def __init__(self):
        self.lineage_log = []
        
    def record_transformation(self, output_id: str, input_ids: List[str], pipeline_version: str):
        """
        Logs that output_id was created from input_ids using pipeline_version.
        """
        record = {
            "timestamp": datetime.now().isoformat(),
            "output_id": output_id,
            "input_ids": input_ids,
            "pipeline_version": pipeline_version,
            "git_commit": "main_73a21b" # Simulated commit hash
        }
        self.lineage_log.append(record)
        
    def get_lineage(self, feature_id: str) -> List[Dict[str, Any]]:
        return [log for log in self.lineage_log if log["output_id"] == feature_id]
