from __future__ import annotations

from pydantic import BaseModel, Field


class AttendanceEntry(BaseModel):
    employee_name: str = Field(..., min_length=1)
    date: str = Field(..., min_length=1)
    status: str = Field(..., min_length=1)


class AttendancePayload(BaseModel):
    month: str = Field(..., min_length=1)
    entries: list[AttendanceEntry]

    model_config = {"json_schema_extra": {"example": {"month": "August 2026", "entries": [{"employee_name": "Alice", "date": "2026-08-03", "status": "Present"}]}}}
