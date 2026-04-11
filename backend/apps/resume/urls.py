from django.urls import path
from .views import (
    ResumeListCreateView,
    ResumeDetailView,
    ResumeExportPDFView,
    ResumeTogglePublicView,
)
from apps.ai.views import GenerateAIView

urlpatterns = [
    path('', ResumeListCreateView.as_view(), name='resume-list-create'),
    path('<uuid:pk>/', ResumeDetailView.as_view(), name='resume-detail'),
    path('<uuid:pk>/export-pdf/', ResumeExportPDFView.as_view(), name='resume-export-pdf'),
    path('<uuid:pk>/toggle-public/', ResumeTogglePublicView.as_view(), name='resume-toggle-public'),
    # TZ: /api/resumes/:id/generate-ai — AI bilan matn generatsiya (TZ ga mos endpoint)
    path('<uuid:pk>/generate-ai/', GenerateAIView.as_view(), name='resume-generate-ai'),
]
