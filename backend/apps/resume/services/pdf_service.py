"""
PDF yaratish servisi.
WeasyPrint yordamida HTML shablonni PDF formatga o'giradi.
"""
import io
from django.template.loader import render_to_string
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration


TEMPLATE_MAP = {
    'minimal': 'resumes/minimal.html',
    'professional': 'resumes/professional.html',
    'modern': 'resumes/modern.html',
    'creative': 'resumes/creative.html',
    'academic': 'resumes/academic.html',
}


def generate_pdf(resume) -> bytes:
    """
    Resume obyektidan PDF bytes yaratadi.

    Args:
        resume: Resume model instance

    Returns:
        bytes: PDF fayl content
    """
    template_name = TEMPLATE_MAP.get(resume.template_id, 'resumes/minimal.html')

    # Agar AI content bo'lsa, uni asosiy dataga merge qilamiz
    context_data = {**resume.data}
    if resume.ai_content:
        _merge_ai_content(context_data, resume.ai_content)

    html_content = render_to_string(template_name, {
        'resume': resume,
        'data': context_data,
        'language': resume.language,
    })

    font_config = FontConfiguration()
    css = CSS(string='''
        @page {
            margin: 1.5cm;
            size: A4;
        }
        body {
            font-family: "Helvetica Neue", Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.4;
        }
    ''', font_config=font_config)

    pdf_bytes = HTML(string=html_content).write_pdf(
        stylesheets=[css],
        font_config=font_config
    )
    return pdf_bytes


def _merge_ai_content(data: dict, ai_content: dict) -> None:
    """AI tomonidan yaxshilangan matnlarni asosiy dataga qo'shadi."""
    if 'summary' in ai_content:
        data.setdefault('personal', {})['summary'] = ai_content['summary']
    if 'experience' in ai_content:
        for i, exp in enumerate(data.get('experience', [])):
            if i < len(ai_content['experience']):
                exp['description'] = ai_content['experience'][i].get('description', exp.get('description', ''))
