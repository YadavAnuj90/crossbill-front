from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from app.core.logger import get_logger
from app.schemas.attendance import AttendancePayload
from app.services.pdf_service import PDFService

router = APIRouter()
logger = get_logger()
pdf_service = PDFService()


@router.post("/attendance/generate", tags=["Attendance"], response_class=StreamingResponse)
def generate_attendance(payload: AttendancePayload, request: Request) -> StreamingResponse:
    logger.info("Generating attendance PDF for month={month}", month=payload.month)
    context = pdf_service.build_context("attendance.html", payload.model_dump())
    pdf_bytes = pdf_service.stream_pdf("attendance.html", context)
    headers = {"Content-Disposition": "attachment; filename=attendance.pdf"}
    return StreamingResponse(iter([pdf_bytes]), media_type="application/pdf", headers=headers)
