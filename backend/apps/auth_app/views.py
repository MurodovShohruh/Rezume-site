from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.utils import extend_schema

from common.responses import success_response, error_response
from .serializers import RegisterSerializer, LoginSerializer, UserProfileSerializer
from .services import generate_tokens, logout_user


class RegisterView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=RegisterSerializer, tags=['Auth'])
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        tokens = generate_tokens(user)
        return success_response({
            **tokens,
            'user': UserProfileSerializer(user).data,
        }, status_code=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(request=LoginSerializer, tags=['Auth'])
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data['user']
        tokens = generate_tokens(user)
        return success_response({
            **tokens,
            'user': UserProfileSerializer(user).data,
        })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=['Auth'])
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return error_response({'refresh': 'Refresh token talab qilinadi.'}, status.HTTP_400_BAD_REQUEST)

        logout_user(request.user, refresh_token)
        return success_response({'detail': 'Muvaffaqiyatli chiqildi.'})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=['Auth'])
    def get(self, request):
        return success_response(UserProfileSerializer(request.user).data)

    @extend_schema(request=UserProfileSerializer, tags=['Auth'])
    def patch(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return success_response(serializer.data)


class CustomTokenRefreshView(TokenRefreshView):
    """JWT refresh tokenni yangilash."""
