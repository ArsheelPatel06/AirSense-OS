"""Telemetry collector for system performance monitoring."""
from typing import Dict, List, Any
import logging
from .metrics import Metric
import time

class TelemetryCollector:
    """
    Collects performance metrics across the system (Latency, Memory, etc.)
    Intended to be exported to Prometheus, Datadog, or Grafana later.
    """
    def __init__(self):
        self.logger = logging.getLogger("Telemetry")
        self._metrics: List[Metric] = []
        self._timers: Dict[str, float] = {}

    def record_metric(self, name: str, value: float, unit: str = "", tags: Dict[str, str] = None) -> None:
        metric = Metric(name=name, value=value, unit=unit, tags=tags or {})
        self._metrics.append(metric)
        # Keep buffer small for now
        if len(self._metrics) > 1000:
            self._metrics.pop(0)

    def start_timer(self, name: str) -> None:
        self._timers[name] = time.time()

    def stop_timer(self, name: str, tags: Dict[str, str] = None) -> float:
        if name not in self._timers:
            return 0.0
        
        duration_ms = (time.time() - self._timers[name]) * 1000
        self.record_metric(f"{name}_duration", duration_ms, "ms", tags)
        del self._timers[name]
        return duration_ms
        
    def dump_recent(self, limit: int = 50) -> List[Dict[str, Any]]:
        return [m.__dict__ for m in self._metrics[-limit:]]
