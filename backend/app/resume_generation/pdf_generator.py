from io import BytesIO
from html import escape
from typing import Any

from fastapi import HTTPException, status


def _as_list(value: Any) -> list:
    return value if isinstance(value, list) else []


def _format_item(item: Any) -> str:
    if isinstance(item, dict):
        return " | ".join(f"{key.replace('_', ' ').title()}: {value}" for key, value in item.items() if value)
    return str(item)


def _safe_text(value: Any) -> str:
    return escape(str(value or ""))


def generate_resume_pdf(content: dict[str, Any]) -> bytes:
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer
    except ImportError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="reportlab is not installed. Run pip install -r requirements.txt.",
        ) from exc

    buffer = BytesIO()
    document = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=42, leftMargin=42, topMargin=42, bottomMargin=42)
    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph(_safe_text(content.get("full_name") or "Resume"), styles["Title"]))
    contact = " | ".join(filter(None, [content.get("email"), content.get("phone")]))
    if contact:
        story.append(Paragraph(_safe_text(contact), styles["Normal"]))
    story.append(Spacer(1, 14))

    def add_section(title: str, body_items: list[str]) -> None:
        story.append(Paragraph(title, styles["Heading2"]))
        for item in body_items:
            story.append(Paragraph(item, styles["BodyText"]))
            story.append(Spacer(1, 6))
        story.append(Spacer(1, 8))

    if content.get("professional_summary"):
        add_section("Professional Summary", [_safe_text(content["professional_summary"])])

    add_section("Skills", [_safe_text(", ".join(_format_item(item) for item in _as_list(content.get("skills"))) or "Not provided")])

    experience_lines = []
    for item in _as_list(content.get("experience")):
        if isinstance(item, dict):
            heading = _safe_text(f"{item.get('job_title', '')} - {item.get('company_name', '')} ({item.get('duration', '')})")
            bullets = _safe_text("; ".join(_format_item(point) for point in _as_list(item.get("responsibilities"))))
            experience_lines.append(f"<b>{heading}</b><br/>{bullets}")
        else:
            experience_lines.append(_safe_text(item))
    add_section("Experience", experience_lines or ["Not provided"])

    for section in ["education", "projects", "certifications"]:
        items = [_safe_text(_format_item(item)) for item in _as_list(content.get(section))]
        add_section(section.replace("_", " ").title(), items or ["Not provided"])

    try:
        document.build(story)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"PDF generation failed: {exc}",
        ) from exc
    buffer.seek(0)
    return buffer.read()
