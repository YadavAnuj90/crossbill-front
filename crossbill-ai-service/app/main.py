from __future__ import annotations

import time
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import Response

from app.api.v1 import attendance, health, invoice, offer_letter, payslip
from app.core.config import get_settings
from app.core.logger import configure_logging, get_logger

settings = get_settings()
logger = get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    configure_logging(settings.log_level)
    logger.info("Starting application {name}", name=settings.app_name)
    yield
    logger.info("Shutting down application")


app = FastAPI(
    title=settings.app_title,
    version=settings.app_version,
    description="Generate professional PDF documents from JSON payloads.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next) -> Response:
    start_time = time.perf_counter()
    logger.info("Incoming request method={method} path={path}", method=request.method, path=request.url.path)
    try:
        response = await call_next(request)
    except Exception as exc:
        logger.exception("Unhandled exception while processing request", exc_info=exc)
        raise
    elapsed = time.perf_counter() - start_time
    logger.info("Completed request method={method} path={path} status={status} duration_ms={duration_ms}", method=request.method, path=request.url.path, status=response.status_code, duration_ms=round(elapsed * 1000, 2))
    return response

app.include_router(health.router, prefix="/api/v1")
app.include_router(invoice.router, prefix="/api/v1")
app.include_router(offer_letter.router, prefix="/api/v1")
app.include_router(attendance.router, prefix="/api/v1")
app.include_router(payslip.router, prefix="/api/v1")
