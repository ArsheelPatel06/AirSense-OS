"""Common utility and validation helper functions."""
import uuid
import math
from typing import Any, Union, Optional
from datetime import datetime
from air_quality_agent.constants import FanSpeed, SPEED_TO_NUMERIC

def clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(value, hi))

def safe_float(val: Any, default: float = 0.0) -> float:
    try:
        if val is None: return default
        return float(val)
    except (ValueError, TypeError):
        return default

def safe_int(val: Any, default: int = 0) -> int:
    try:
        if val is None: return default
        return int(val)
    except (ValueError, TypeError):
        return default

def sanitize_numpy(obj: Any) -> Any:
    import numpy as np
    if isinstance(obj, dict):
        return {k: sanitize_numpy(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize_numpy(v) for v in obj]
    elif isinstance(obj, (np.int_, np.intc, np.intp, np.int8, np.int16, np.int32, np.int64, 
                          np.uint8, np.uint16, np.uint32, np.uint64)):
        return int(obj)
    elif isinstance(obj, (np.float_, np.float16, np.float32, np.float64)):
        return float(obj)
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()
    return obj

def speed_to_numeric(speed: Union[str, FanSpeed]) -> int:
    if isinstance(speed, FanSpeed):
        return SPEED_TO_NUMERIC.get(speed, 0)
    try:
        speed_enum = FanSpeed(str(speed).upper())
        return SPEED_TO_NUMERIC.get(speed_enum, 0)
    except ValueError:
        return 0

def parse_timestamp(ts: Any) -> Optional[datetime]:
    if isinstance(ts, datetime):
        return ts
    if not isinstance(ts, str):
        return None
    try:
        return datetime.fromisoformat(ts.replace("Z", "+00:00"))
    except ValueError:
        return None

def sigmoid(x: float) -> float:
    try:
        return 1 / (1 + math.exp(-x))
    except OverflowError:
        return 0.0 if x < 0 else 1.0

def generate_cycle_id() -> str:
    return str(uuid.uuid4())
