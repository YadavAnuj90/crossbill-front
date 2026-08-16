from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from app.core.logger import get_logger
from app.schemas.payslip import PayslipPayload
from app.services.pdf_service import PDFService

router = APIRouter()
logger = get_logger()
pdf_service = PDFService()


@router.post("/payslip/generate", tags=["Payslips"], response_class=StreamingResponse)
def generate_payslip(payload: PayslipPayload, request: Request) -> StreamingResponse:
    logger.info("Generating payslip PDF for employee={employee}", employee=payload.employee_name)
    context = pdf_service.build_context("payslip.html", payload.model_dump())
    pdf_bytes = pdf_service.stream_pdf("payslip.html", context)
    headers = {"Content-Disposition": "attachment; filename=payslip.pdf"}
    return StreamingResponse(iter([pdf_bytes]), media_type="application/pdf", headers=headers)
