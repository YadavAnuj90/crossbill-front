from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from app.core.logger import get_logger
from app.schemas.offer_letter import OfferLetterPayload
from app.services.pdf_service import PDFService

router = APIRouter()
logger = get_logger()
pdf_service = PDFService()


@router.post("/offer-letter/generate", tags=["Offer Letters"], response_class=StreamingResponse)
def generate_offer_letter(payload: OfferLetterPayload, request: Request) -> StreamingResponse:
    logger.info("Generating offer letter PDF for candidate={candidate}", candidate=payload.candidate_name)
    context = pdf_service.build_context("offer_letter.html", payload.model_dump())
    pdf_bytes = pdf_service.stream_pdf("offer_letter.html", context)
    headers = {"Content-Disposition": "attachment; filename=offer_letter.pdf"}
    return StreamingResponse(iter([pdf_bytes]), media_type="application/pdf", headers=headers)
