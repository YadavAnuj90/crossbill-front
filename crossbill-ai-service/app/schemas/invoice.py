from __future__ import annotations

from typing import List

from pydantic import BaseModel, Field


class InvoiceItem(BaseModel):
    name: str = Field(..., min_length=1)
    qty: int = Field(..., ge=1)
    price: float = Field(..., ge=0)


class InvoicePayload(BaseModel):
    invoice_number: str = Field(..., min_length=1)
    customer: str = Field(..., min_length=1)
    date: str = Field(..., min_length=1)
    items: List[InvoiceItem]

    model_config = {"json_schema_extra": {"example": {"invoice_number": "INV-1001", "customer": "John Doe", "date": "2026-08-03", "items": [{"name": "Laptop", "qty": 2, "price": 50000}]}}}
