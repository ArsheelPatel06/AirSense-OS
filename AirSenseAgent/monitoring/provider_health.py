"""
Provider Health Monitor.

Tracks per-provider:
    API latency (ms)
    HTTP error rate
    Quota / rate-limit status
    Last successful update
    Missing field rate
    Uptime percentage

Usage:
    monitor = ProviderHealthMonitor()
    with monitor.track("OfficialCPCB"):
        records = provider.fetch_realtime()

    report = monitor.report()
"""
from __future__ import annotations

import contextlib
import json
import logging
import time
from collections import defaultdict
from dataclasses import asdict, dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Generator

logger = logging.getLogger(__name__)


@dataclass
class ProviderMetrics:
    """Rolling metrics for a single provider."""
    name: str
    total_calls: int = 0
    successful_calls: int = 0
    failed_calls: int = 0
    total_latency_ms: float = 0.0
    last_success: str = ""
    last_failure: str = ""
    last_error: str = ""
    rate_limited: bool = False
    missing_field_count: int = 0
    total_fields_checked: int = 0

    @property
    def uptime_pct(self) -> float:
        if self.total_calls == 0:
            return 0.0
        return round((self.successful_calls / self.total_calls) * 100, 1)

    @property
    def avg_latency_ms(self) -> float:
        if self.successful_calls == 0:
            return 0.0
        return round(self.total_latency_ms / self.successful_calls, 1)

    @property
    def missing_field_rate(self) -> float:
        if self.total_fields_checked == 0:
            return 0.0
        return round((self.missing_field_count / self.total_fields_checked) * 100, 1)


class ProviderHealthMonitor:
    """
    Lightweight, in-process provider health tracker.

    For production, export metrics to a time-series DB (e.g. Prometheus/InfluxDB).
    """

    def __init__(self, log_dir: str | Path = "monitoring/logs"):
        self._log_dir = Path(log_dir)
        self._log_dir.mkdir(parents=True, exist_ok=True)
        self._metrics: dict[str, ProviderMetrics] = {}

    def _get(self, name: str) -> ProviderMetrics:
        if name not in self._metrics:
            self._metrics[name] = ProviderMetrics(name=name)
        return self._metrics[name]

    @contextlib.contextmanager
    def track(self, provider_name: str) -> Generator[None, None, None]:
        """
        Context manager to track a provider call.

        Usage:
            with monitor.track("OfficialCPCB"):
                data = provider.fetch()
        """
        m = self._get(provider_name)
        m.total_calls += 1
        start = time.perf_counter()
        try:
            yield
            elapsed_ms = (time.perf_counter() - start) * 1000
            m.successful_calls += 1
            m.total_latency_ms += elapsed_ms
            m.last_success = datetime.utcnow().isoformat()
            logger.debug(f"[Monitor] {provider_name} OK — {elapsed_ms:.0f}ms")
        except Exception as exc:
            m.failed_calls += 1
            m.last_failure = datetime.utcnow().isoformat()
            m.last_error = str(exc)[:200]
            if "429" in str(exc) or "rate" in str(exc).lower():
                m.rate_limited = True
            logger.warning(f"[Monitor] {provider_name} FAILED — {exc}")
            raise

    def record_fields(self, provider_name: str,
                      record: dict, required: list[str]) -> None:
        """Track missing field rate for a provider's output record."""
        m = self._get(provider_name)
        for f in required:
            m.total_fields_checked += 1
            if record.get(f) is None:
                m.missing_field_count += 1

    def report(self) -> dict[str, dict]:
        """Return a snapshot of all provider metrics including computed properties."""
        result = {}
        for name, m in self._metrics.items():
            d = asdict(m)
            d["uptime_pct"] = m.uptime_pct
            d["avg_latency_ms"] = m.avg_latency_ms
            d["missing_field_rate"] = m.missing_field_rate
            result[name] = d
        return result


    def save_report(self) -> Path:
        """Persist the current metrics report to a JSON file."""
        path = self._log_dir / f"health_{datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}.json"
        path.write_text(json.dumps(self.report(), indent=2), encoding="utf-8")
        logger.info(f"[Monitor] Health report saved → {path}")
        return path

    def summary(self) -> None:
        """Print a human-readable summary to stdout."""
        print(f"\n{'='*60}")
        print("  Provider Health Summary")
        print(f"{'='*60}")
        for name, m in self._metrics.items():
            status = "✓" if m.uptime_pct >= 90 else "✗"
            print(
                f"  {status} {name:<25} "
                f"uptime={m.uptime_pct:>5.1f}%  "
                f"avg={m.avg_latency_ms:>6.0f}ms  "
                f"calls={m.total_calls}"
            )
        print(f"{'='*60}\n")
