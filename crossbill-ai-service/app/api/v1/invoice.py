from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from app.core.logger import get_logger
from app.schemas.invoice import InvoicePayload
from app.services.pdf_service import PDFService

router = APIRouter()
logger = get_logger()
pdf_service = PDFService()


@router.post("/invoice/generate", tags=["Invoices"], response_class=StreamingResponse)
def generate_invoice(payload: InvoicePayload, request: Request) -> StreamingResponse:
    logger.info("Generating invoice PDF for customer={customer}", customer=payload.customer)
    context = pdf_service.build_context("invoice.html", payload.model_dump())
    pdf_bytes = pdf_service.stream_pdf("invoice.html", context)
    headers = {"Content-Disposition": "attachment; filename=invoice.pdf"}
    return StreamingResponse(iter([pdf_bytes]), media_type="application/pdf", headers=headers)
