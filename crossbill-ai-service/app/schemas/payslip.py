from __future__ import annotations

from pydantic import BaseModel, Field


class PayslipPayload(BaseModel):
    employee_name: str = Field(..., min_length=1)
    month: str = Field(..., min_length=1)
    basic_salary: float = Field(..., ge=0)
    allowances: float = Field(..., ge=0)
    deductions: float = Field(..., ge=0)

    model_config = {"json_schema_extra": {"example": {"employee_name": "Alice", "month": "August 2026", "basic_salary": 80000, "allowances": 12000, "deductions": 5000}}}
