import uuid
from django.db import models
from django.conf import settings


class ResumeView(models.Model):
    """Resume ko'rishlar logi (public rezumeler uchun)."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    resume = models.ForeignKey(
        'resume.Resume',
        on_delete=models.CASCADE,
        related_name='view_logs'
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'resume_views'
        ordering = ['-viewed_at']


class PDFDownload(models.Model):
    """PDF yuklab olishlar logi."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    resume = models.ForeignKey(
        'resume.Resume',
        on_delete=models.CASCADE,
        related_name='pdf_downloads'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    downloaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'pdf_downloads'
        ordering = ['-downloaded_at']
