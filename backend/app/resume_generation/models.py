from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.resumes.models import Resume  # noqa: F401
from app.users.models import User  # noqa: F401


class GeneratedResume(Base):
    __tablename__ = "generated_resumes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    resume_id: Mapped[int] = mapped_column(ForeignKey("resumes.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    generated_content: Mapped[str] = mapped_column(Text, nullable=False)
    format_type: Mapped[str] = mapped_column(String(30), nullable=False, default="ai_json")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
