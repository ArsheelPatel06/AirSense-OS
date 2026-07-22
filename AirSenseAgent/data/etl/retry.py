"""
Retry & Recovery Utility.

Government APIs fail. Often.

This module provides:
    - @retry decorator with exponential backoff
    - RetryConfig for fine-tuning per-connector retry policy
    - ResumeCache for persisting partially fetched data so a timeout
      doesn't lose what was already downloaded

Usage:
    from data.etl.retry import retry, RetryConfig

    config = RetryConfig(max_attempts=5, base_delay=2.0, timeout=30)

    @retry(config)
    def fetch_from_cpcb():
        ...

    # Or ad-hoc:
    result = retry(config)(my_function)(arg1, arg2)
"""
from __future__ import annotations

import functools
import json
import logging
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable, TypeVar

logger = logging.getLogger(__name__)

F = TypeVar("F", bound=Callable[..., Any])


@dataclass
class RetryConfig:
    """
    Controls the retry behaviour for a single operation.

    Attributes:
        max_attempts : Total number of attempts (1 = no retry).
        base_delay   : Initial delay in seconds before first retry.
        backoff      : Multiplier applied to delay after each attempt.
        max_delay    : Upper cap on delay between retries (seconds).
        timeout      : Per-attempt timeout in seconds (0 = no timeout).
        retry_on     : Exception types that trigger a retry.
                       Defaults to a broad set of transient errors.
    """
    max_attempts: int = 4
    base_delay: float = 2.0
    backoff: float = 2.0
    max_delay: float = 60.0
    timeout: float = 30.0
    retry_on: tuple[type[Exception], ...] = field(
        default_factory=lambda: (
            ConnectionError,
            TimeoutError,
            OSError,
        )
    )


# Default config for government APIs (aggressive retry)
# Default config for government APIs (aggressive retry — data.gov.in is slow)
def _make_gov_retry() -> RetryConfig:
    """Build GOV_API_RETRY with requests exceptions included if requests is available."""
    base_exceptions: list[type[Exception]] = [ConnectionError, TimeoutError, OSError]
    try:
        import requests.exceptions as req_exc
        base_exceptions += [
            req_exc.Timeout,
            req_exc.ConnectionError,
            req_exc.ReadTimeout,
            req_exc.ConnectTimeout,
            req_exc.HTTPError,
        ]
    except ImportError:
        pass
    return RetryConfig(
        max_attempts=5,
        base_delay=3.0,
        backoff=2.0,
        max_delay=120.0,
        timeout=90.0,
        retry_on=tuple(base_exceptions),
    )

GOV_API_RETRY = _make_gov_retry()


# Light config for fast internal operations
FAST_RETRY = RetryConfig(
    max_attempts=2,
    base_delay=0.5,
    backoff=2.0,
    max_delay=5.0,
    timeout=10.0,
)


def retry(config: RetryConfig | None = None) -> Callable[[F], F]:
    """
    Decorator factory for exponential-backoff retry.

    Wraps a function so it is automatically retried on transient failures.
    Each attempt waits `base_delay * backoff^(attempt-1)` seconds, capped
    at `max_delay`.

    Example:
        @retry(GOV_API_RETRY)
        def call_cpcb_api():
            ...
    """
    cfg = config or RetryConfig()

    def decorator(fn: F) -> F:
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            delay = cfg.base_delay
            last_exc: Exception | None = None

            for attempt in range(1, cfg.max_attempts + 1):
                try:
                    logger.debug(f"[retry] {fn.__name__} attempt {attempt}/{cfg.max_attempts}")
                    return fn(*args, **kwargs)

                except cfg.retry_on as exc:
                    last_exc = exc
                    if attempt == cfg.max_attempts:
                        break

                    wait = min(delay, cfg.max_delay)
                    logger.warning(
                        f"[retry] {fn.__name__} failed (attempt {attempt}): {exc}. "
                        f"Retrying in {wait:.1f}s…"
                    )
                    time.sleep(wait)
                    delay *= cfg.backoff

                except Exception as exc:
                    # Non-retryable — propagate immediately
                    logger.error(f"[retry] {fn.__name__} non-retryable error: {exc}")
                    raise

            logger.error(
                f"[retry] {fn.__name__} exhausted all {cfg.max_attempts} attempts. "
                f"Last error: {last_exc}"
            )
            raise last_exc  # type: ignore[misc]

        return wrapper  # type: ignore[return-value]
    return decorator


class ResumeCache:
    """
    Persist partial fetch results so a mid-run timeout doesn't lose data.

    A connector that fetches 1000 pages can checkpoint every N pages.
    On resume, it picks up from the last checkpoint.

    Usage:
        cache = ResumeCache("data/lake/raw/.resume/cpcb_fetch.json")
        if cache.has_checkpoint():
            pages_done = cache.load()
        else:
            pages_done = []

        for page in range(len(pages_done), total_pages):
            data = fetch_page(page)
            pages_done.append(data)
            cache.save(pages_done)

        cache.clear()  # done — remove checkpoint
    """

    def __init__(self, path: str | Path):
        self._path = Path(path)
        self._path.parent.mkdir(parents=True, exist_ok=True)

    def has_checkpoint(self) -> bool:
        return self._path.exists()

    def save(self, data: Any) -> None:
        self._path.write_text(
            json.dumps(data, default=str),
            encoding="utf-8",
        )
        logger.debug(f"[ResumeCache] Checkpoint saved → {self._path}")

    def load(self) -> Any:
        data = json.loads(self._path.read_text(encoding="utf-8"))
        logger.info(f"[ResumeCache] Resuming from checkpoint: {self._path}")
        return data

    def clear(self) -> None:
        if self._path.exists():
            self._path.unlink()
            logger.debug(f"[ResumeCache] Checkpoint cleared: {self._path}")
