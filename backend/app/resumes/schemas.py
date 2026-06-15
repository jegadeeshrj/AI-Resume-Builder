from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, HttpUrl


class ResumeBase(BaseModel):
    resume_title: str = Field(min_length=1, max_length=160)
    professional_summary: Optional[str] = None


class ResumeCreate(ResumeBase):
    pass


class ResumeUpdate(BaseModel):
    resume_title: Optional[str] = Field(default=None, min_length=1, max_length=160)
    professional_summary: Optional[str] = None


class PersonalDetailsBase(BaseModel):
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=30, pattern=r"^[0-9+\-\s().]+$")
    linkedin_url: Optional[HttpUrl] = None
    github_url: Optional[HttpUrl] = None
    portfolio_url: Optional[HttpUrl] = None
    address: Optional[str] = Field(default=None, max_length=255)
    city: Optional[str] = Field(default=None, max_length=100)
    state: Optional[str] = Field(default=None, max_length=100)
    country: Optional[str] = Field(default=None, max_length=100)
    postal_code: Optional[str] = Field(default=None, max_length=30)


class PersonalDetailsCreate(PersonalDetailsBase):
    pass


class PersonalDetailsUpdate(BaseModel):
    first_name: Optional[str] = Field(default=None, min_length=1, max_length=80)
    last_name: Optional[str] = Field(default=None, min_length=1, max_length=80)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(default=None, min_length=7, max_length=30, pattern=r"^[0-9+\-\s().]+$")
    linkedin_url: Optional[HttpUrl] = None
    github_url: Optional[HttpUrl] = None
    portfolio_url: Optional[HttpUrl] = None
    address: Optional[str] = Field(default=None, max_length=255)
    city: Optional[str] = Field(default=None, max_length=100)
    state: Optional[str] = Field(default=None, max_length=100)
    country: Optional[str] = Field(default=None, max_length=100)
    postal_code: Optional[str] = Field(default=None, max_length=30)


class PersonalDetailsResponse(PersonalDetailsBase):
    id: int
    resume_id: int

    model_config = ConfigDict(from_attributes=True)


class EducationBase(BaseModel):
    degree: str = Field(min_length=1, max_length=160)
    institution: str = Field(min_length=1, max_length=180)
    field_of_study: Optional[str] = Field(default=None, max_length=160)
    start_year: Optional[int] = Field(default=None, ge=1900, le=2200)
    end_year: Optional[int] = Field(default=None, ge=1900, le=2200)
    grade: Optional[str] = Field(default=None, max_length=60)
    description: Optional[str] = None


class EducationCreate(EducationBase):
    pass


class EducationUpdate(BaseModel):
    degree: Optional[str] = Field(default=None, min_length=1, max_length=160)
    institution: Optional[str] = Field(default=None, min_length=1, max_length=180)
    field_of_study: Optional[str] = Field(default=None, max_length=160)
    start_year: Optional[int] = Field(default=None, ge=1900, le=2200)
    end_year: Optional[int] = Field(default=None, ge=1900, le=2200)
    grade: Optional[str] = Field(default=None, max_length=60)
    description: Optional[str] = None


class EducationResponse(EducationBase):
    id: int
    resume_id: int

    model_config = ConfigDict(from_attributes=True)


class ExperienceBase(BaseModel):
    company_name: str = Field(min_length=1, max_length=180)
    job_title: str = Field(min_length=1, max_length=160)
    employment_type: Optional[str] = Field(default=None, max_length=80)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    currently_working: bool = False
    description: Optional[str] = None


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    company_name: Optional[str] = Field(default=None, min_length=1, max_length=180)
    job_title: Optional[str] = Field(default=None, min_length=1, max_length=160)
    employment_type: Optional[str] = Field(default=None, max_length=80)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    currently_working: Optional[bool] = None
    description: Optional[str] = None


class ExperienceResponse(ExperienceBase):
    id: int
    resume_id: int

    model_config = ConfigDict(from_attributes=True)


class SkillBase(BaseModel):
    skill_name: str = Field(min_length=1, max_length=120)
    skill_level: Optional[str] = Field(default=None, max_length=60)


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    skill_name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    skill_level: Optional[str] = Field(default=None, max_length=60)


class SkillResponse(SkillBase):
    id: int
    resume_id: int

    model_config = ConfigDict(from_attributes=True)


class ProjectBase(BaseModel):
    project_name: str = Field(min_length=1, max_length=180)
    technologies: Optional[str] = Field(default=None, max_length=255)
    project_url: Optional[HttpUrl] = None
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    project_name: Optional[str] = Field(default=None, min_length=1, max_length=180)
    technologies: Optional[str] = Field(default=None, max_length=255)
    project_url: Optional[HttpUrl] = None
    description: Optional[str] = None


class ProjectResponse(ProjectBase):
    id: int
    resume_id: int

    model_config = ConfigDict(from_attributes=True)


class CertificationBase(BaseModel):
    certification_name: str = Field(min_length=1, max_length=180)
    issuing_organization: str = Field(min_length=1, max_length=180)
    issue_date: Optional[date] = None
    expiration_date: Optional[date] = None
    credential_id: Optional[str] = Field(default=None, max_length=120)
    credential_url: Optional[HttpUrl] = None


class CertificationCreate(CertificationBase):
    pass


class CertificationUpdate(BaseModel):
    certification_name: Optional[str] = Field(default=None, min_length=1, max_length=180)
    issuing_organization: Optional[str] = Field(default=None, min_length=1, max_length=180)
    issue_date: Optional[date] = None
    expiration_date: Optional[date] = None
    credential_id: Optional[str] = Field(default=None, max_length=120)
    credential_url: Optional[HttpUrl] = None


class CertificationResponse(CertificationBase):
    id: int
    resume_id: int

    model_config = ConfigDict(from_attributes=True)


class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ResumeDetailResponse(ResumeResponse):
    personal_details: Optional[PersonalDetailsResponse] = None
    education: list[EducationResponse] = Field(default_factory=list)
    experience: list[ExperienceResponse] = Field(default_factory=list)
    skills: list[SkillResponse] = Field(default_factory=list)
    projects: list[ProjectResponse] = Field(default_factory=list)
    certifications: list[CertificationResponse] = Field(default_factory=list)
