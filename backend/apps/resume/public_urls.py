from django.urls import path
from .views import PublicResumeView

urlpatterns = [
    path('<slug:slug>/', PublicResumeView.as_view(), name='resume-public'),
]
