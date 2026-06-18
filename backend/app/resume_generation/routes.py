from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.resume_generation.pdf_generator import generate_resume_pdf
from app.resume_generation.schemas import GeneratedResumeResponse, GeneratedResumeStatusResponse
from app.resume_generation.service import generate_resume_content, get_latest_generated_content, has_generated_resume
from app.resume_generation.word_generator import generate_resume_docx
from app.users.models import User


router = APIRouter(prefix="/resume-generation", tags=["Resume Generation"])

DbSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post("/{resume_id}/generate", response_model=GeneratedResumeResponse)
def generate_resume(resume_id: int, db: DbSession, current_user: CurrentUser):
    generated_content = generate_resume_content(db, resume_id, current_user)
    return GeneratedResumeResponse(resume_id=resume_id, generated_content=generated_content)


@router.get("/{resume_id}/status", response_model=GeneratedResumeStatusResponse)
def generated_resume_status(resume_id: int, db: DbSession, current_user: CurrentUser):
    return GeneratedResumeStatusResponse(
        resume_id=resume_id,
        has_generated_resume=has_generated_resume(db, resume_id, current_user),
    )


@router.get("/{resume_id}/download/pdf")
def download_resume_pdf(resume_id: int, db: DbSession, current_user: CurrentUser):
    content = get_latest_generated_content(db, resume_id, current_user)
    pdf_bytes = generate_resume_pdf(content)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="resume_{resume_id}.pdf"'},
    )


@router.get("/{resume_id}/download/word")
def download_resume_word(resume_id: int, db: DbSession, current_user: CurrentUser):
    content = get_latest_generated_content(db, resume_id, current_user)
    docx_bytes = generate_resume_docx(content)
    return Response(
        content=docx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="resume_{resume_id}.docx"'},
    )
