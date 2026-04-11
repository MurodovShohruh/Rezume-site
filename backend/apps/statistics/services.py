from django.db.models import Sum, Count
from apps.resume.models import Resume
from .models import PDFDownload


def get_user_statistics(user) -> dict:
    """Foydalanuvchining umumiy statistikasini qaytaradi."""
    resumes = Resume.objects.filter(user=user).prefetch_related('pdf_downloads')

    resume_stats = []
    total_views = 0
    total_downloads = 0

    for resume in resumes:
        dl_count = resume.pdf_downloads.count()
        total_views += resume.view_count
        total_downloads += dl_count
        resume_stats.append({
            'resume_id': resume.id,
            'title': resume.title,
            'view_count': resume.view_count,
            'pdf_download_count': dl_count,
            'is_public': resume.is_public,
            'created_at': resume.created_at,
        })

    return {
        'total_resumes': resumes.count(),
        'public_resumes': resumes.filter(is_public=True).count(),
        'total_views': total_views,
        'total_pdf_downloads': total_downloads,
        'resumes': resume_stats,
    }


def log_pdf_download(resume, user=None) -> None:
    """PDF yuklab olishni logga yozadi."""
    PDFDownload.objects.create(resume=resume, user=user)


def log_resume_view(resume, ip_address: str = None, user_agent: str = '') -> None:
    """Resume ko'rishni logga yozadi."""
    from .models import ResumeView
    ResumeView.objects.create(
        resume=resume,
        ip_address=ip_address,
        user_agent=user_agent[:500],
    )
    resume.increment_views()
