from __future__ import annotations

import logging
import sys
from typing import Any

from loguru import logger


class InterceptHandler(logging.Handler):
    """Redirect standard logging into Loguru."""

    def emit(self, record: logging.LogRecord) -> None:
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno
        logger.opt(depth=6, exception=record.exc_info).log(level, record.getMessage())


def configure_logging(log_level: str = "INFO") -> None:
    """Configure application logging."""
    logging.basicConfig(handlers=[InterceptHandler()], level=0)
    logger.remove()
    logger.add(sys.stdout, level=log_level, enqueue=True, backtrace=True, diagnose=False)
    logging.getLogger("uvicorn").handlers = [InterceptHandler()]
    logging.getLogger("uvicorn.access").handlers = [InterceptHandler()]


def get_logger() -> Any:
    """Return the application logger instance."""
    return logger
