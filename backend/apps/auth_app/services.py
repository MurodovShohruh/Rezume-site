from rest_framework_simplejwt.tokens import RefreshToken
from .models import User


def generate_tokens(user: User) -> dict:
    """Foydalanuvchi uchun access va refresh token yaratadi."""
    refresh = RefreshToken.for_user(user)
    tokens = {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
    # Refresh tokenni DBga saqlash
    user.refresh_token = tokens['refresh']
    user.save(update_fields=['refresh_token'])
    return tokens


def logout_user(user: User, refresh_token: str) -> None:
    """Refresh tokenni blacklistga qo'shadi va DBdan o'chiradi."""
    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
    except Exception:
        pass
    user.refresh_token = None
    user.save(update_fields=['refresh_token'])


def get_user_profile(user: User) -> dict:
    return {
        'id': str(user.id),
        'email': user.email,
        'full_name': user.full_name,
        'avatar_url': user.avatar_url,
        'is_verified': user.is_verified,
        'created_at': user.created_at.isoformat(),
    }
