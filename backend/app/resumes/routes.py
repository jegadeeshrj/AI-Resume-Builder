from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.resumes import schemas, service
from app.users.models import User


router = APIRouter(tags=["Resumes"])


DbSession = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.post("/resumes", response_model=schemas.ResumeResponse, status_code=status.HTTP_201_CREATED)
def create_resume(payload: schemas.ResumeCreate, db: DbSession, current_user: CurrentUser):
    return service.create_resume(db, current_user.id, payload)


@router.get("/resumes", response_model=list[schemas.ResumeResponse])
def list_resumes(db: DbSession, current_user: CurrentUser):
    return service.list_resumes(db, current_user.id)


@router.get("/resumes/{resume_id}", response_model=schemas.ResumeDetailResponse)
def get_resume(resume_id: int, db: DbSession, current_user: CurrentUser):
    return service.get_resume(db, resume_id, current_user.id)


@router.put("/resumes/{resume_id}", response_model=schemas.ResumeResponse)
def update_resume(resume_id: int, payload: schemas.ResumeUpdate, db: DbSession, current_user: CurrentUser):
    return service.update_resume(db, resume_id, current_user.id, payload)


@router.delete("/resumes/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(resume_id: int, db: DbSession, current_user: CurrentUser):
    service.delete_resume(db, resume_id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/resumes/{resume_id}/personal-details",
    response_model=schemas.PersonalDetailsResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_personal_details(
    resume_id: int,
    payload: schemas.PersonalDetailsCreate,
    db: DbSession,
    current_user: CurrentUser,
):
    return service.create_personal_details(db, resume_id, current_user.id, payload)


@router.get("/resumes/{resume_id}/personal-details", response_model=schemas.PersonalDetailsResponse)
def get_personal_details(resume_id: int, db: DbSession, current_user: CurrentUser):
    return service.get_personal_details(db, resume_id, current_user.id)


@router.put("/resumes/{resume_id}/personal-details", response_model=schemas.PersonalDetailsResponse)
def update_personal_details(
    resume_id: int,
    payload: schemas.PersonalDetailsUpdate,
    db: DbSession,
    current_user: CurrentUser,
):
    return service.update_personal_details(db, resume_id, current_user.id, payload)


@router.post("/resumes/{resume_id}/education", response_model=schemas.EducationResponse, status_code=status.HTTP_201_CREATED)
def create_education(resume_id: int, payload: schemas.EducationCreate, db: DbSession, current_user: CurrentUser):
    return service.create_education(db, resume_id, current_user.id, payload)


@router.get("/resumes/{resume_id}/education", response_model=list[schemas.EducationResponse])
def list_education(resume_id: int, db: DbSession, current_user: CurrentUser):
    return service.list_education(db, resume_id, current_user.id)


@router.put("/education/{id}", response_model=schemas.EducationResponse)
def update_education(id: int, payload: schemas.EducationUpdate, db: DbSession, current_user: CurrentUser):
    return service.update_education(db, id, current_user.id, payload)


@router.delete("/education/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_education(id: int, db: DbSession, current_user: CurrentUser):
    service.delete_education(db, id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/resumes/{resume_id}/experience", response_model=schemas.ExperienceResponse, status_code=status.HTTP_201_CREATED)
def create_experience(resume_id: int, payload: schemas.ExperienceCreate, db: DbSession, current_user: CurrentUser):
    return service.create_experience(db, resume_id, current_user.id, payload)


@router.get("/resumes/{resume_id}/experience", response_model=list[schemas.ExperienceResponse])
def list_experience(resume_id: int, db: DbSession, current_user: CurrentUser):
    return service.list_experience(db, resume_id, current_user.id)


@router.put("/experience/{id}", response_model=schemas.ExperienceResponse)
def update_experience(id: int, payload: schemas.ExperienceUpdate, db: DbSession, current_user: CurrentUser):
    return service.update_experience(db, id, current_user.id, payload)


@router.delete("/experience/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experience(id: int, db: DbSession, current_user: CurrentUser):
    service.delete_experience(db, id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/resumes/{resume_id}/skills", response_model=schemas.SkillResponse, status_code=status.HTTP_201_CREATED)
def create_skill(resume_id: int, payload: schemas.SkillCreate, db: DbSession, current_user: CurrentUser):
    return service.create_skill(db, resume_id, current_user.id, payload)


@router.get("/resumes/{resume_id}/skills", response_model=list[schemas.SkillResponse])
def list_skills(resume_id: int, db: DbSession, current_user: CurrentUser):
    return service.list_skills(db, resume_id, current_user.id)


@router.put("/skills/{id}", response_model=schemas.SkillResponse)
def update_skill(id: int, payload: schemas.SkillUpdate, db: DbSession, current_user: CurrentUser):
    return service.update_skill(db, id, current_user.id, payload)


@router.delete("/skills/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_skill(id: int, db: DbSession, current_user: CurrentUser):
    service.delete_skill(db, id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/resumes/{resume_id}/projects", response_model=schemas.ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(resume_id: int, payload: schemas.ProjectCreate, db: DbSession, current_user: CurrentUser):
    return service.create_project(db, resume_id, current_user.id, payload)


@router.get("/resumes/{resume_id}/projects", response_model=list[schemas.ProjectResponse])
def list_projects(resume_id: int, db: DbSession, current_user: CurrentUser):
    return service.list_projects(db, resume_id, current_user.id)


@router.put("/projects/{id}", response_model=schemas.ProjectResponse)
def update_project(id: int, payload: schemas.ProjectUpdate, db: DbSession, current_user: CurrentUser):
    return service.update_project(db, id, current_user.id, payload)


@router.delete("/projects/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(id: int, db: DbSession, current_user: CurrentUser):
    service.delete_project(db, id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/resumes/{resume_id}/certifications",
    response_model=schemas.CertificationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_certification(
    resume_id: int,
    payload: schemas.CertificationCreate,
    db: DbSession,
    current_user: CurrentUser,
):
    return service.create_certification(db, resume_id, current_user.id, payload)


@router.get("/resumes/{resume_id}/certifications", response_model=list[schemas.CertificationResponse])
def list_certifications(resume_id: int, db: DbSession, current_user: CurrentUser):
    return service.list_certifications(db, resume_id, current_user.id)


@router.put("/certifications/{id}", response_model=schemas.CertificationResponse)
def update_certification(id: int, payload: schemas.CertificationUpdate, db: DbSession, current_user: CurrentUser):
    return service.update_certification(db, id, current_user.id, payload)


@router.delete("/certifications/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_certification(id: int, db: DbSession, current_user: CurrentUser):
    service.delete_certification(db, id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
