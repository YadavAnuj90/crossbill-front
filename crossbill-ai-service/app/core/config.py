from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    app_name: str = Field(default="crossbill-ai", alias="APP_NAME")
    app_title: str = Field(default="CrossBill AI PDF Service", alias="APP_TITLE")
    app_version: str = Field(default="0.1.0", alias="APP_VERSION")
    environment: str = Field(default="development", alias="ENVIRONMENT")
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")
    debug: bool = Field(default=True, alias="DEBUG")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    templates_dir: str = Field(default=str(BASE_DIR / "templates"), alias="TEMPLATES_DIR")
    static_dir: str = Field(default=str(BASE_DIR / "static"), alias="STATIC_DIR")
    output_dir: str = Field(default=str(BASE_DIR / "output"), alias="OUTPUT_DIR")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached settings object."""
    return Settings()
