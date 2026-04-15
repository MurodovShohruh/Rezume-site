from django.urls import path
from .views import (
    ResumeListCreateView,
    ResumeDetailView,
    ResumeExportPDFView,
    ResumeExportWordView,
    ResumeTogglePublicView,
)
from apps.ai.views import GenerateAIView

urlpatterns = [
    path('', ResumeListCreateView.as_view(), name='resume-list-create'),
    path('<uuid:pk>/', ResumeDetailView.as_view(), name='resume-detail'),
    path('<uuid:pk>/export-pdf/', ResumeExportPDFView.as_view(), name='resume-export-pdf'),
    # V2 — Word eksport
    path('<uuid:pk>/export-word/', ResumeExportWordView.as_view(), name='resume-export-word'),
    path('<uuid:pk>/toggle-public/', ResumeTogglePublicView.as_view(), name='resume-toggle-public'),
    path('<uuid:pk>/generate-ai/', GenerateAIView.as_view(), name='resume-generate-ai'),
]
