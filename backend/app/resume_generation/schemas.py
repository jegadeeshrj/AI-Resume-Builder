from typing import Any

from pydantic import BaseModel, ConfigDict


class GeneratedResumeResponse(BaseModel):
    resume_id: int
    generated_content: dict[str, Any]


class GeneratedResumeStatusResponse(BaseModel):
    resume_id: int
    has_generated_resume: bool


class GeneratedResumeRecordResponse(BaseModel):
    id: int
    resume_id: int
    user_id: int
    generated_content: str
    format_type: str

    model_config = ConfigDict(from_attributes=True)
