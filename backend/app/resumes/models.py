from datetime import date, datetime
from typing import Optional

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    resume_title: Mapped[str] = mapped_column(String(160), nullable=False)
    professional_summary: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    personal_details: Mapped[Optional["PersonalDetails"]] = relationship(
        back_populates="resume",
        cascade="all, delete-orphan",
        uselist=False,
    )
    education: Mapped[list["Education"]] = relationship(back_populates="resume", cascade="all, delete-orphan")
    experience: Mapped[list["Experience"]] = relationship(back_populates="resume", cascade="all, delete-orphan")
    skills: Mapped[list["Skill"]] = relationship(back_populates="resume", cascade="all, delete-orphan")
    projects: Mapped[list["Project"]] = relationship(back_populates="resume", cascade="all, delete-orphan")
    certifications: Mapped[list["Certification"]] = relationship(back_populates="resume", cascade="all, delete-orphan")


class PersonalDetails(Base):
    __tablename__ = "personal_details"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    resume_id: Mapped[int] = mapped_column(ForeignKey("resumes.id", ondelete="CASCADE"), unique=True, index=True)
    first_name: Mapped[str] = mapped_column(String(80), nullable=False)
    last_name: Mapped[str] = mapped_column(String(80), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(30), nullable=False)
    linkedin_url: Mapped[Optional[str]] = mapped_column(String(255))
    github_url: Mapped[Optional[str]] = mapped_column(String(255))
    portfolio_url: Mapped[Optional[str]] = mapped_column(String(255))
    address: Mapped[Optional[str]] = mapped_column(String(255))
    city: Mapped[Optional[str]] = mapped_column(String(100))
    state: Mapped[Optional[str]] = mapped_column(String(100))
    country: Mapped[Optional[str]] = mapped_column(String(100))
    postal_code: Mapped[Optional[str]] = mapped_column(String(30))

    resume: Mapped[Resume] = relationship(back_populates="personal_details")


class Education(Base):
    __tablename__ = "education"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    resume_id: Mapped[int] = mapped_column(ForeignKey("resumes.id", ondelete="CASCADE"), index=True)
    degree: Mapped[str] = mapped_column(String(160), nullable=False)
    institution: Mapped[str] = mapped_column(String(180), nullable=False)
    field_of_study: Mapped[Optional[str]] = mapped_column(String(160))
    start_year: Mapped[Optional[int]] = mapped_column(Integer)
    end_year: Mapped[Optional[int]] = mapped_column(Integer)
    grade: Mapped[Optional[str]] = mapped_column(String(60))
    description: Mapped[Optional[str]] = mapped_column(Text)

    resume: Mapped[Resume] = relationship(back_populates="education")


class Experience(Base):
    __tablename__ = "experience"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    resume_id: Mapped[int] = mapped_column(ForeignKey("resumes.id", ondelete="CASCADE"), index=True)
    company_name: Mapped[str] = mapped_column(String(180), nullable=False)
    job_title: Mapped[str] = mapped_column(String(160), nullable=False)
    employment_type: Mapped[Optional[str]] = mapped_column(String(80))
    start_date: Mapped[Optional[date]] = mapped_column(Date)
    end_date: Mapped[Optional[date]] = mapped_column(Date)
    currently_working: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    description: Mapped[Optional[str]] = mapped_column(Text)

    resume: Mapped[Resume] = relationship(back_populates="experience")


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    resume_id: Mapped[int] = mapped_column(ForeignKey("resumes.id", ondelete="CASCADE"), index=True)
    skill_name: Mapped[str] = mapped_column(String(120), nullable=False)
    skill_level: Mapped[Optional[str]] = mapped_column(String(60))

    resume: Mapped[Resume] = relationship(back_populates="skills")


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    resume_id: Mapped[int] = mapped_column(ForeignKey("resumes.id", ondelete="CASCADE"), index=True)
    project_name: Mapped[str] = mapped_column(String(180), nullable=False)
    technologies: Mapped[Optional[str]] = mapped_column(String(255))
    project_url: Mapped[Optional[str]] = mapped_column(String(255))
    description: Mapped[Optional[str]] = mapped_column(Text)

    resume: Mapped[Resume] = relationship(back_populates="projects")


class Certification(Base):
    __tablename__ = "certifications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    resume_id: Mapped[int] = mapped_column(ForeignKey("resumes.id", ondelete="CASCADE"), index=True)
    certification_name: Mapped[str] = mapped_column(String(180), nullable=False)
    issuing_organization: Mapped[str] = mapped_column(String(180), nullable=False)
    issue_date: Mapped[Optional[date]] = mapped_column(Date)
    expiration_date: Mapped[Optional[date]] = mapped_column(Date)
    credential_id: Mapped[Optional[str]] = mapped_column(String(120))
    credential_url: Mapped[Optional[str]] = mapped_column(String(255))

    resume: Mapped[Resume] = relationship(back_populates="certifications")
