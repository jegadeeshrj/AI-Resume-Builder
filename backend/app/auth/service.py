import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Tuple
from urllib.parse import urlencode

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.auth.email_service import send_password_reset_email
from app.auth.password_reset_model import PasswordResetToken
from app.auth.password_reset_schema import ForgotPasswordRequest, ResetPasswordRequest
from app.auth.schemas import LoginRequest, RegisterRequest
from app.auth.security import create_access_token, hash_password, verify_password
from app.config import get_settings
from app.users.models import User
from app.users.service import create_user, get_user_by_email


FORGOT_PASSWORD_MESSAGE = "If the email exists, a password reset link has been sent."


def register_user(db: Session, payload: RegisterRequest) -> User:
    existing_user = get_user_by_email(db, payload.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    return create_user(db, payload.full_name, payload.email, payload.password)


def login_user(db: Session, payload: LoginRequest) -> Tuple[str, User]:
    user = get_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    return create_access_token(user.id), user


def hash_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def request_password_reset(db: Session, payload: ForgotPasswordRequest) -> str:
    user = get_user_by_email(db, payload.email)
    if not user:
        return FORGOT_PASSWORD_MESSAGE

    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.is_used.is_(False),
    ).update({"is_used": True})

    raw_token = secrets.token_urlsafe(32)
    token_hash = hash_reset_token(raw_token)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

    reset_token = PasswordResetToken(
        user_id=user.id,
        token=token_hash,
        expires_at=expires_at,
    )
    db.add(reset_token)
    db.commit()

    settings = get_settings()
    reset_link = f"{settings.frontend_reset_password_url}?{urlencode({'token': raw_token})}"
    try:
        send_password_reset_email(user.email, reset_link)
    except Exception as exc:
        print(f"Password reset email could not be sent: {exc}")
        print(f"Password reset link for {user.email}: {reset_link}")

    return FORGOT_PASSWORD_MESSAGE


def reset_password(db: Session, payload: ResetPasswordRequest) -> str:
    token_hash = hash_reset_token(payload.token)
    reset_token = (
        db.query(PasswordResetToken)
        .filter(PasswordResetToken.token == token_hash, PasswordResetToken.is_used.is_(False))
        .first()
    )

    if not reset_token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")

    expires_at = reset_token.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at < datetime.now(timezone.utc):
        reset_token.is_used = True
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")

    user = db.get(User, reset_token.user_id)
    if not user or not user.is_active:
        reset_token.is_used = True
        db.commit()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token")

    user.password_hash = hash_password(payload.new_password)
    reset_token.is_used = True
    db.commit()

    return "Password has been reset successfully."
