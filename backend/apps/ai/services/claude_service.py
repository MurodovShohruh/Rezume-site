"""
Anthropic Claude API bilan ishlash servisi.
"""
import json
import anthropic
from django.conf import settings
from .prompts import (
    OPTIMIZE_RESUME_PROMPT,
    GENERATE_COVER_LETTER_PROMPT,
    ATS_ANALYSIS_PROMPT,
    LANGUAGE_NAMES,
)


def _get_client() -> anthropic.Anthropic:
    return anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)


def optimize_resume(resume_data: dict, language: str = 'uz') -> dict:
    """
    Resume ma'lumotlarini Claude AI bilan professional tarzda optimallashtiradi.

    Args:
        resume_data: Resume JSONB data
        language: Til kodi ('uz', 'ru', 'en')

    Returns:
        dict: AI tomonidan yaxshilangan matnlar
            {
                "summary": "...",
                "experience": [{"index": 0, "description": "..."}]
            }
    """
    client = _get_client()
    language_name = LANGUAGE_NAMES.get(language, "O'zbek")

    prompt = OPTIMIZE_RESUME_PROMPT.format(
        language=language_name,
        resume_data=json.dumps(resume_data, ensure_ascii=False, indent=2),
    )

    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = message.content[0].text.strip()
    # JSON kodlarini tozalaymiz
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw)


def generate_cover_letter(
    resume_data: dict,
    job_title: str,
    company_name: str,
    language: str = 'uz',
) -> str:
    """
    Resume asosida motivatsion xat yaratadi.

    Returns:
        str: Motivatsion xat matni
    """
    client = _get_client()
    language_name = LANGUAGE_NAMES.get(language, "O'zbek")

    prompt = GENERATE_COVER_LETTER_PROMPT.format(
        language=language_name,
        job_title=job_title,
        company_name=company_name,
        resume_data=json.dumps(resume_data, ensure_ascii=False, indent=2),
    )

    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}],
    )

    return message.content[0].text.strip()


def analyze_ats(resume_data: dict, job_description: str = '') -> dict:
    """
    Resumeni ATS tizimlari uchun tahlil qiladi va ball beradi.

    Returns:
        dict: { score, strengths, weaknesses, missing_keywords, suggestions }
    """
    client = _get_client()

    prompt = ATS_ANALYSIS_PROMPT.format(
        resume_data=json.dumps(resume_data, ensure_ascii=False, indent=2),
        job_description=job_description or "Ko'rsatilmagan",
    )

    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}],
    )

    raw = message.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw)
