from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.auth.password_reset_schema import ForgotPasswordRequest, MessageResponse, ResetPasswordRequest
from app.auth.schemas import LoginRequest, RegisterRequest, TokenResponse
from app.auth.service import login_user, register_user, request_password_reset, reset_password
from app.database import get_db
from app.dependencies import get_current_user
from app.users.models import User
from app.users.schemas import UserResponse


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Annotated[Session, Depends(get_db)]):
    return register_user(db, payload)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Annotated[Session, Depends(get_db)]):
    access_token, user = login_user(db, payload)
    return TokenResponse(access_token=access_token, user=user)


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(payload: ForgotPasswordRequest, db: Annotated[Session, Depends(get_db)]):
    return MessageResponse(message=request_password_reset(db, payload))


@router.post("/reset-password", response_model=MessageResponse)
def reset_password_route(payload: ResetPasswordRequest, db: Annotated[Session, Depends(get_db)]):
    return MessageResponse(message=reset_password(db, payload))


@router.get("/me", response_model=UserResponse)
def me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user
