import smtplib
from email.message import EmailMessage

from app.config import get_settings


def send_password_reset_email(email: str, reset_link: str) -> None:
    settings = get_settings()

    if not settings.smtp_host or not settings.smtp_from_email:
        print(f"Password reset link for {email}: {reset_link}")
        return

    message = EmailMessage()
    message["Subject"] = "Reset your AI Resume Builder password"
    message["From"] = settings.smtp_from_email
    message["To"] = email
    message.set_content(
        "Use the link below to reset your password. This link expires in 15 minutes.\n\n"
        f"{reset_link}\n\n"
        "If you did not request this password reset, you can ignore this email."
    )

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
        server.starttls()
        if settings.smtp_username and settings.smtp_password:
            server.login(settings.smtp_username, settings.smtp_password)
        server.send_message(message)
