import json
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.resume_generation.azure_openai_service import generate_resume_with_azure
from app.resume_generation.models import GeneratedResume
from app.resumes.repository import get_resume_detail
from app.users.models import User


def get_owned_resume(db: Session, resume_id: int, user: User):
    resume = get_resume_detail(db, resume_id)
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    if resume.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this resume")
    return resume


def serialize_resume(resume) -> dict[str, Any]:
    personal = resume.personal_details
    return {
        "resume_title": resume.resume_title,
        "professional_summary": resume.professional_summary,
        "personal_details": {
            "first_name": personal.first_name,
            "last_name": personal.last_name,
            "email": personal.email,
            "phone": personal.phone,
            "linkedin_url": personal.linkedin_url,
            "github_url": personal.github_url,
            "portfolio_url": personal.portfolio_url,
            "city": personal.city,
            "state": personal.state,
            "country": personal.country,
        }
        if personal
        else None,
        "education": [
            {
                "degree": item.degree,
                "institution": item.institution,
                "field_of_study": item.field_of_study,
                "start_year": item.start_year,
                "end_year": item.end_year,
                "grade": item.grade,
                "description": item.description,
            }
            for item in resume.education
        ],
        "experience": [
            {
                "company_name": item.company_name,
                "job_title": item.job_title,
                "employment_type": item.employment_type,
                "start_date": item.start_date,
                "end_date": item.end_date,
                "currently_working": item.currently_working,
                "description": item.description,
            }
            for item in resume.experience
        ],
        "skills": [{"skill_name": item.skill_name, "skill_level": item.skill_level} for item in resume.skills],
        "projects": [
            {
                "project_name": item.project_name,
                "technologies": item.technologies,
                "project_url": item.project_url,
                "description": item.description,
            }
            for item in resume.projects
        ],
        "certifications": [
            {
                "certification_name": item.certification_name,
                "issuing_organization": item.issuing_organization,
                "issue_date": item.issue_date,
                "expiration_date": item.expiration_date,
                "credential_id": item.credential_id,
                "credential_url": item.credential_url,
            }
            for item in resume.certifications
        ],
    }


def generate_resume_content(db: Session, resume_id: int, user: User) -> dict[str, Any]:
    resume = get_owned_resume(db, resume_id, user)
    resume_data = serialize_resume(resume)
    generated_content = generate_resume_with_azure(resume_data)

    record = GeneratedResume(
        resume_id=resume.id,
        user_id=user.id,
        generated_content=json.dumps(generated_content),
        format_type="ai_json",
    )
    db.add(record)
    db.commit()

    return generated_content


def get_latest_generated_content(db: Session, resume_id: int, user: User) -> dict[str, Any]:
    get_owned_resume(db, resume_id, user)
    record = (
        db.query(GeneratedResume)
        .filter(GeneratedResume.resume_id == resume_id, GeneratedResume.user_id == user.id)
        .order_by(GeneratedResume.created_at.desc())
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Generated resume not found. Generate the resume before downloading.",
        )
    return json.loads(record.generated_content)


def has_generated_resume(db: Session, resume_id: int, user: User) -> bool:
    get_owned_resume(db, resume_id, user)
    return (
        db.query(GeneratedResume.id)
        .filter(GeneratedResume.resume_id == resume_id, GeneratedResume.user_id == user.id)
        .first()
        is not None
    )
