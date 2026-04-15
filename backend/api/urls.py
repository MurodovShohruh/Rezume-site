from django.urls import path, include
from api.docs import urlpatterns as swagger_urls

urlpatterns = [
    # ── Auth ──────────────────────────────────────────────────────────────
    path('auth/', include('apps.auth_app.urls')),

    # ── Resume ────────────────────────────────────────────────────────────
    path('resumes/', include('apps.resume.urls')),

    # ── AI ────────────────────────────────────────────────────────────────
    path('ai/', include('apps.ai.urls')),

    # ── Statistics ────────────────────────────────────────────────────────
    path('statistics/', include('apps.statistics.urls')),

    # ── Public (no auth) ──────────────────────────────────────────────────
    path('public/', include('apps.resume.public_urls')),
    path('gallery/', include('apps.resume.gallery_urls')),

    # ── Swagger / OpenAPI ─────────────────────────────────────────────────
    *swagger_urls,
]
