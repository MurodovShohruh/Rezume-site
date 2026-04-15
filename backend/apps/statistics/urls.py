from django.urls import path
from .views import UserStatisticsView

urlpatterns = [
    path('me/', UserStatisticsView.as_view(), name='statistics-me'),
]
