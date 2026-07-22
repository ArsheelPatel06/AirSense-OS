"""
AirSense Settings — Single source of truth for all configuration.

All secrets are loaded from environment variables / .env file.
Never hardcode keys. Never commit .env.

Usage:
    from config.settings import settings

    key = settings.data_gov_api_key
    weather_key = settings.openweather_api_key
"""
from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings backed by environment variables.

    Pydantic-settings reads from:
      1. Environment variables
      2. .env file in the project root
    in that order (env vars take precedence).
    """

    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parent.parent / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Database ──────────────────────────────────────────────────────────────
    mongodb_uri: str = Field(default="", description="MongoDB Atlas connection string")
    db_name: str = Field(default="environment_monitoring")

    # ── CPCB / data.gov.in ────────────────────────────────────────────────────
    data_gov_api_key: str = Field(default="", description="data.gov.in API key for CPCB data")

    # CPCB resource IDs on data.gov.in (official)
    cpcb_realtime_resource_id: str = Field(
        default="3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69",
        description="OGD India real-time station data resource ID",
    )
    cpcb_station_resource_id: str = Field(
        default="f0fba5de-cefc-49ee-9e9c-275f4f91d06c",
        description="OGD India station listing resource ID",
    )

    # ── Weather / OpenWeather ─────────────────────────────────────────────────
    openweather_api_key: str = Field(default="", description="OpenWeatherMap API key")
    openweather_base_url: str = Field(default="https://api.openweathermap.org/data/2.5")

    # ── Copernicus / Sentinel ─────────────────────────────────────────────────
    copernicus_username: str = Field(default="")
    copernicus_password: str = Field(default="")

    # ── Google Earth Engine ───────────────────────────────────────────────────
    gee_service_account: str = Field(default="")
    gee_private_key: str = Field(default="")

    # ── App ───────────────────────────────────────────────────────────────────
    environment: Literal["development", "staging", "production"] = Field(default="development")
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = Field(default="INFO")
    lake_root: str = Field(default="data/lake")

    # ── Derived helpers ───────────────────────────────────────────────────────

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def has_cpcb_key(self) -> bool:
        return bool(self.data_gov_api_key and self.data_gov_api_key != "your_data_gov_api_key_here")

    @property
    def has_weather_key(self) -> bool:
        return bool(self.openweather_api_key and self.openweather_api_key != "your_openweather_api_key_here")

    @property
    def lake_path(self) -> Path:
        return Path(self.lake_root)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached singleton Settings instance."""
    return Settings()


# Module-level convenience alias
settings = get_settings()
