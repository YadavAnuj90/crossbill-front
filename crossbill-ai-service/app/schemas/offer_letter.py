from __future__ import annotations

from pydantic import BaseModel, Field


class OfferLetterPayload(BaseModel):
    candidate_name: str = Field(..., min_length=1)
    company_name: str = Field(..., min_length=1)
    position: str = Field(..., min_length=1)
    joining_date: str = Field(..., min_length=1)
    salary: float = Field(..., ge=0)
    date: str = Field(..., min_length=1)

    model_config = {"json_schema_extra": {"example": {"candidate_name": "Jane Doe", "company_name": "CrossBill", "position": "Software Engineer", "joining_date": "2026-09-01", "salary": 120000, "date": "2026-08-03"}}}
