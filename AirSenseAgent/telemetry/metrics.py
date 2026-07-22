"""Standardized Metric types for the telemetry subsystem."""
from dataclasses import dataclass
from typing import Dict, Any, Optional
import time

@dataclass
class Metric:
    name: str
    value: float
    unit: str
    tags: Dict[str, str]
    timestamp: float = time.time()

class MetricType:
    LATENCY_MS = "latency_ms"
    MEMORY_USAGE_MB = "memory_usage_mb"
    CPU_USAGE_PCT = "cpu_usage_pct"
    CACHE_HIT_RATE = "cache_hit_rate"
    ERROR_COUNT = "error_count"
