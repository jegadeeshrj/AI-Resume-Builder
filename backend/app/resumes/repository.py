from __future__ import annotations

from typing import TypeVar

from pydantic import BaseModel
from sqlalchemy.orm import Session, selectinload

from app.resumes.models import Certification, Education, Experience, PersonalDetails, Project, Resume, Skill


ResumeChild = TypeVar("ResumeChild", Certification, Education, Experience, PersonalDetails, Project, Skill)


def payload_data(payload: BaseModel, exclude_unset: bool = False) -> dict:
    return payload.model_dump(mode="json", exclude_unset=exclude_unset)


def get_resume(db: Session, resume_id: int) -> Resume | None:
    return db.get(Resume, resume_id)


def get_resume_detail(db: Session, resume_id: int) -> Resume | None:
    return (
        db.query(Resume)
        .options(
            selectinload(Resume.personal_details),
            selectinload(Resume.education),
            selectinload(Resume.experience),
            selectinload(Resume.skills),
            selectinload(Resume.projects),
            selectinload(Resume.certifications),
        )
        .filter(Resume.id == resume_id)
        .first()
    )


def list_user_resumes(db: Session, user_id: int) -> list[Resume]:
    return db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.updated_at.desc()).all()


def create_resume(db: Session, user_id: int, data: dict) -> Resume:
    resume = Resume(user_id=user_id, **data)
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


def update_record(db: Session, record: ResumeChild, data: dict) -> ResumeChild:
    for field, value in data.items():
        setattr(record, field, value)
    db.commit()
    db.refresh(record)
    return record


def delete_record(db: Session, record: ResumeChild) -> None:
    db.delete(record)
    db.commit()


def get_personal_details(db: Session, resume_id: int) -> PersonalDetails | None:
    return db.query(PersonalDetails).filter(PersonalDetails.resume_id == resume_id).first()


def create_personal_details(db: Session, resume_id: int, data: dict) -> PersonalDetails:
    record = PersonalDetails(resume_id=resume_id, **data)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def list_education(db: Session, resume_id: int) -> list[Education]:
    return db.query(Education).filter(Education.resume_id == resume_id).order_by(Education.id.desc()).all()


def get_education(db: Session, record_id: int) -> Education | None:
    return db.get(Education, record_id)


def create_education(db: Session, resume_id: int, data: dict) -> Education:
    record = Education(resume_id=resume_id, **data)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def list_experience(db: Session, resume_id: int) -> list[Experience]:
    return db.query(Experience).filter(Experience.resume_id == resume_id).order_by(Experience.id.desc()).all()


def get_experience(db: Session, record_id: int) -> Experience | None:
    return db.get(Experience, record_id)


def create_experience(db: Session, resume_id: int, data: dict) -> Experience:
    record = Experience(resume_id=resume_id, **data)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def list_skills(db: Session, resume_id: int) -> list[Skill]:
    return db.query(Skill).filter(Skill.resume_id == resume_id).order_by(Skill.id.desc()).all()


def get_skill(db: Session, record_id: int) -> Skill | None:
    return db.get(Skill, record_id)


def create_skill(db: Session, resume_id: int, data: dict) -> Skill:
    record = Skill(resume_id=resume_id, **data)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def list_projects(db: Session, resume_id: int) -> list[Project]:
    return db.query(Project).filter(Project.resume_id == resume_id).order_by(Project.id.desc()).all()


def get_project(db: Session, record_id: int) -> Project | None:
    return db.get(Project, record_id)


def create_project(db: Session, resume_id: int, data: dict) -> Project:
    record = Project(resume_id=resume_id, **data)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def list_certifications(db: Session, resume_id: int) -> list[Certification]:
    return db.query(Certification).filter(Certification.resume_id == resume_id).order_by(Certification.id.desc()).all()


def get_certification(db: Session, record_id: int) -> Certification | None:
    return db.get(Certification, record_id)


def create_certification(db: Session, resume_id: int, data: dict) -> Certification:
    record = Certification(resume_id=resume_id, **data)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
