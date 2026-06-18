import json
import re
from typing import Any

from fastapi import HTTPException, status

from app.config import get_settings


SYSTEM_PROMPT = """
You are a professional resume writer and ATS resume optimization expert.

Generate a clean, professional, ATS-friendly resume from the provided user data.

Important rules:

1. Do not invent any fake information.
2. Use only the data provided by the user.
3. If any section has no data, empty value, null, undefined, "Not added", "N/A", "-", or empty array, completely exclude that section from the final resume.
4. Do not show placeholder text like:
   - Not added
   - N/A
   - Not provided
   - No data available
5. Improve grammar and rewrite weak sentences professionally.
6. Keep the resume concise and professional.
7. Use strong action verbs for experience and project descriptions.
8. Make important keywords bold using this format: **keyword**.
9. Keep technical skills, tools, frameworks, programming languages, cloud platforms, and important achievements in bold where suitable.
10. Format the Education section as a table.
11. Format the Experience section with company name, job title, duration, and bullet points.
12. Format Projects with project name, technologies, and key responsibilities.
13. Format Skills in grouped categories if possible.
14. Return the response in structured JSON only.
15. Do not include markdown explanation outside JSON.
16. Do not include any section that has no valid data.
"""


EXPECTED_JSON_INSTRUCTIONS = """
Return only valid JSON in this shape:
{
  "full_name": "",
  "email": "",
  "phone": "",
  "professional_summary": "",
  "skills": [],
  "experience": [
    {
      "job_title": "",
      "company_name": "",
      "duration": "",
      "responsibilities": []
    }
  ],
  "education": [],
  "projects": [],
  "certifications": []
}
"""


def build_resume_prompt(resume_data: dict[str, Any]) -> str:
    return (
        f"{SYSTEM_PROMPT}\n\n"
        f"{EXPECTED_JSON_INSTRUCTIONS}\n\n"
        "Use this resume data. Do not include passwords, tokens, or unrelated account data.\n\n"
        f"{json.dumps(resume_data, default=str, indent=2)}"
    )


def parse_resume_json(content: str) -> dict[str, Any]:
    cleaned = content.strip()
    if cleaned.startswith("```"):
      cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
      cleaned = re.sub(r"\s*```$", "", cleaned)
    return json.loads(cleaned)


def generate_resume_with_azure(resume_data: dict[str, Any]) -> dict[str, Any]:
    settings = get_settings()
    if not settings.azure_openai_endpoint or not settings.azure_openai_api_key or not settings.azure_openai_deployment_name:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Azure OpenAI is not configured.",
        )

    try:
        from openai import AzureOpenAI
    except ImportError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="OpenAI package is not installed. Run pip install -r requirements.txt.",
        ) from exc

    client = AzureOpenAI(
        azure_endpoint=settings.azure_openai_endpoint,
        api_key=settings.azure_openai_api_key,
        api_version=settings.azure_openai_api_version,
    )

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": build_resume_prompt(resume_data)},
    ]

    try:
        response = client.chat.completions.create(
            model=settings.azure_openai_deployment_name,
            messages=messages,
            temperature=0.2,
            response_format={"type": "json_object"},
        )
        content = response.choices[0].message.content or "{}"
        return parse_resume_json(content)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Azure OpenAI returned invalid JSON.",
        ) from exc
    except Exception as exc:
        if "response_format" not in str(exc):
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Azure OpenAI generation failed: {exc}",
            ) from exc

    try:
        response = client.chat.completions.create(
            model=settings.azure_openai_deployment_name,
            messages=messages,
            temperature=0.2,
        )
        content = response.choices[0].message.content or "{}"
        return parse_resume_json(content)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Azure OpenAI returned invalid JSON.",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Azure OpenAI generation failed: {exc}",
        ) from exc
