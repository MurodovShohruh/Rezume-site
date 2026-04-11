from django.urls import path
from .views import GenerateAIView, CoverLetterView, ATSAnalysisView

urlpatterns = [
    path('resumes/<uuid:pk>/generate/', GenerateAIView.as_view(), name='ai-generate'),
    path('resumes/<uuid:pk>/cover-letter/', CoverLetterView.as_view(), name='ai-cover-letter'),
    path('resumes/<uuid:pk>/ats-analysis/', ATSAnalysisView.as_view(), name='ai-ats-analysis'),
]
