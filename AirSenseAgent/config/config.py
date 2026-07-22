"""System-wide configuration regarding file paths, networking, and environment basics."""
from pathlib import Path
import os

# --- Project Paths ---
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"
DATA_DIR = BASE_DIR / "data"
LOG_DIR = BASE_DIR / "logs"
PROMPTS_DIR = BASE_DIR / "prompts"
CACHE_DIR = BASE_DIR / "cache"

for directory in [MODEL_DIR, DATA_DIR, LOG_DIR, PROMPTS_DIR, CACHE_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# --- Database ---
DB_NAME = "environment_monitoring"
MONGODB_URI_ENV_KEY = "MONGODB_URI"
