from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.resumes import repository
from app.resumes.models import Resume
from app.resumes.schemas import (
    CertificationCreate,
    CertificationUpdate,
    EducationCreate,
    EducationUpdate,
    ExperienceCreate,
    ExperienceUpdate,
    PersonalDetailsCreate,
    PersonalDetailsUpdate,
    ProjectCreate,
    ProjectUpdate,
    ResumeCreate,
    ResumeUpdate,
    SkillCreate,
    SkillUpdate,
)


def ensure_resume_owner(db: Session, resume_id: int, user_id: int) -> Resume:
    resume = repository.get_resume(db, resume_id)
    if not resume or resume.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    return resume


def ensure_child_owner(db: Session, resume_id: int, user_id: int) -> None:
    ensure_resume_owner(db, resume_id, user_id)


def list_resumes(db: Session, user_id: int):
    return repository.list_user_resumes(db, user_id)


def create_resume(db: Session, user_id: int, payload: ResumeCreate):
    return repository.create_resume(db, user_id, repository.payload_data(payload))


def get_resume(db: Session, resume_id: int, user_id: int):
    resume = repository.get_resume_detail(db, resume_id)
    if not resume or resume.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    return resume


def update_resume(db: Session, resume_id: int, user_id: int, payload: ResumeUpdate):
    resume = ensure_resume_owner(db, resume_id, user_id)
    return repository.update_record(db, resume, repository.payload_data(payload, exclude_unset=True))


def delete_resume(db: Session, resume_id: int, user_id: int) -> None:
    resume = ensure_resume_owner(db, resume_id, user_id)
    repository.delete_record(db, resume)


def create_personal_details(db: Session, resume_id: int, user_id: int, payload: PersonalDetailsCreate):
    ensure_resume_owner(db, resume_id, user_id)
    if repository.get_personal_details(db, resume_id):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Personal details already exist")
    return repository.create_personal_details(db, resume_id, repository.payload_data(payload))


def get_personal_details(db: Session, resume_id: int, user_id: int):
    ensure_resume_owner(db, resume_id, user_id)
    record = repository.get_personal_details(db, resume_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Personal details not found")
    return record


def update_personal_details(db: Session, resume_id: int, user_id: int, payload: PersonalDetailsUpdate):
    record = get_personal_details(db, resume_id, user_id)
    return repository.update_record(db, record, repository.payload_data(payload, exclude_unset=True))


def create_education(db: Session, resume_id: int, user_id: int, payload: EducationCreate):
    ensure_resume_owner(db, resume_id, user_id)
    return repository.create_education(db, resume_id, repository.payload_data(payload))


def list_education(db: Session, resume_id: int, user_id: int):
    ensure_resume_owner(db, resume_id, user_id)
    return repository.list_education(db, resume_id)


def update_education(db: Session, record_id: int, user_id: int, payload: EducationUpdate):
    record = repository.get_education(db, record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Education record not found")
    ensure_child_owner(db, record.resume_id, user_id)
    return repository.update_record(db, record, repository.payload_data(payload, exclude_unset=True))


def delete_education(db: Session, record_id: int, user_id: int) -> None:
    record = repository.get_education(db, record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Education record not found")
    ensure_child_owner(db, record.resume_id, user_id)
    repository.delete_record(db, record)


def create_experience(db: Session, resume_id: int, user_id: int, payload: ExperienceCreate):
    ensure_resume_owner(db, resume_id, user_id)
    return repository.create_experience(db, resume_id, repository.payload_data(payload))


def list_experience(db: Session, resume_id: int, user_id: int):
    ensure_resume_owner(db, resume_id, user_id)
    return repository.list_experience(db, resume_id)


def update_experience(db: Session, record_id: int, user_id: int, payload: ExperienceUpdate):
    record = repository.get_experience(db, record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experience record not found")
    ensure_child_owner(db, record.resume_id, user_id)
    return repository.update_record(db, record, repository.payload_data(payload, exclude_unset=True))


def delete_experience(db: Session, record_id: int, user_id: int) -> None:
    record = repository.get_experience(db, record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experience record not found")
    ensure_child_owner(db, record.resume_id, user_id)
    repository.delete_record(db, record)


def create_skill(db: Session, resume_id: int, user_id: int, payload: SkillCreate):
    ensure_resume_owner(db, resume_id, user_id)
    return repository.create_skill(db, resume_id, repository.payload_data(payload))


def list_skills(db: Session, resume_id: int, user_id: int):
    ensure_resume_owner(db, resume_id, user_id)
    return repository.list_skills(db, resume_id)


def update_skill(db: Session, record_id: int, user_id: int, payload: SkillUpdate):
    record = repository.get_skill(db, record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")
    ensure_child_owner(db, record.resume_id, user_id)
    return repository.update_record(db, record, repository.payload_data(payload, exclude_unset=True))


def delete_skill(db: Session, record_id: int, user_id: int) -> None:
    record = repository.get_skill(db, record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")
    ensure_child_owner(db, record.resume_id, user_id)
    repository.delete_record(db, record)


def create_project(db: Session, resume_id: int, user_id: int, payload: ProjectCreate):
    ensure_resume_owner(db, resume_id, user_id)
    return repository.create_project(db, resume_id, repository.payload_data(payload))


def list_projects(db: Session, resume_id: int, user_id: int):
    ensure_resume_owner(db, resume_id, user_id)
    return repository.list_projects(db, resume_id)


def update_project(db: Session, record_id: int, user_id: int, payload: ProjectUpdate):
    record = repository.get_project(db, record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    ensure_child_owner(db, record.resume_id, user_id)
    return repository.update_record(db, record, repository.payload_data(payload, exclude_unset=True))


def delete_project(db: Session, record_id: int, user_id: int) -> None:
    record = repository.get_project(db, record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    ensure_child_owner(db, record.resume_id, user_id)
    repository.delete_record(db, record)


def create_certification(db: Session, resume_id: int, user_id: int, payload: CertificationCreate):
    ensure_resume_owner(db, resume_id, user_id)
    return repository.create_certification(db, resume_id, repository.payload_data(payload))


def list_certifications(db: Session, resume_id: int, user_id: int):
    ensure_resume_owner(db, resume_id, user_id)
    return repository.list_certifications(db, resume_id)


def update_certification(db: Session, record_id: int, user_id: int, payload: CertificationUpdate):
    record = repository.get_certification(db, record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certification not found")
    ensure_child_owner(db, record.resume_id, user_id)
    return repository.update_record(db, record, repository.payload_data(payload, exclude_unset=True))


def delete_certification(db: Session, record_id: int, user_id: int) -> None:
    record = repository.get_certification(db, record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certification not found")
    ensure_child_owner(db, record.resume_id, user_id)
    repository.delete_record(db, record)
