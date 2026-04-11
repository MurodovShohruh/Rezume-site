import uuid
from django.db import models
from django.conf import settings


class Resume(models.Model):
    LANGUAGE_CHOICES = [('uz', 'O\'zbekcha'), ('ru', 'Ruscha'), ('en', 'Inglizcha')]

    TEMPLATE_CHOICES = [
        ('minimal', 'Minimal'),
        ('professional', 'Professional'),
        ('modern', 'Modern'),
        ('creative', 'Creative'),
        ('academic', 'Academic'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='resumes'
    )
    title = models.CharField(max_length=150)
    template_id = models.CharField(max_length=50, choices=TEMPLATE_CHOICES, default='minimal')

    # Barcha resume ma'lumotlari JSONB da saqlanadi
    data = models.JSONField(default=dict)
    # AI generatsiya qilgan matnlar
    ai_content = models.JSONField(default=dict, null=True, blank=True)

    language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES, default='uz')
    is_public = models.BooleanField(default=False)
    slug = models.SlugField(max_length=100, unique=True, null=True, blank=True)
    pdf_url = models.URLField(null=True, blank=True)
    view_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'resumes'
        ordering = ['-created_at']
        verbose_name = 'Rezume'
        verbose_name_plural = 'Rezumeler'

    def __str__(self):
        return f'{self.user.full_name} – {self.title}'

    def increment_views(self):
        Resume.objects.filter(pk=self.pk).update(view_count=models.F('view_count') + 1)
