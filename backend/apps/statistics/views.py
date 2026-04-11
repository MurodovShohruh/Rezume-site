from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from common.responses import success_response
from .serializers import UserStatsSerializer
from .services import get_user_statistics


class UserStatisticsView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=['Statistics'])
    def get(self, request):
        """Joriy foydalanuvchining statistikasi."""
        stats = get_user_statistics(request.user)
        serializer = UserStatsSerializer(stats)
        return success_response(serializer.data)
