from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.routes import router as auth_router
from app.config import get_settings
from app.database import Base, engine
from app.users.models import User  # noqa: F401


settings = get_settings()

# For Phase 1, tables are created automatically for local development.
# In later phases, this can be replaced with Alembic migrations.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Resume Builder API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
