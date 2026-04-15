"""
Email tasdiqlash servisi.
Token yaratish, saqlash va email yuborish.
"""
import secrets
import hashlib
from datetime import timedelta
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string


# Token necha soat amal qiladi
TOKEN_EXPIRY_HOURS = 24


def _hash_token(raw_token: str) -> str:
    """Tokenni SHA-256 bilan hash qiladi (DBda xavfsiz saqlash uchun)."""
    return hashlib.sha256(raw_token.encode()).hexdigest()


def generate_verification_token(user) -> str:
    """
    Foydalanuvchi uchun tasdiqlash tokeni yaratadi va DBga saqlaydi.
    Returns: raw token (emailga yuboriladigan)
    """
    from .models import EmailVerificationToken

    # Oldingi tokenlarni o'chirish
    EmailVerificationToken.objects.filter(user=user).delete()

    raw_token = secrets.token_urlsafe(32)
    hashed = _hash_token(raw_token)
    expires_at = timezone.now() + timedelta(hours=TOKEN_EXPIRY_HOURS)

    EmailVerificationToken.objects.create(
        user=user,
        token=hashed,
        expires_at=expires_at,
    )
    return raw_token


def send_verification_email(user, raw_token: str) -> None:
    """Tasdiqlash havolasini emailga yuboradi."""
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
    verify_url = f"{frontend_url}/verify-email?token={raw_token}"

    subject = "ResumeAI — Email manzilingizni tasdiqlang"
    message = (
        f"Salom, {user.full_name}!\n\n"
        f"Quyidagi havolani bosing va email manzilingizni tasdiqlang:\n\n"
        f"{verify_url}\n\n"
        f"Havola {TOKEN_EXPIRY_HOURS} soat davomida amal qiladi.\n\n"
        f"Agar siz bu so'rovni yubormagan bo'lsangiz, xabarni e'tiborsiz qoldiring."
    )

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


def verify_email_token(raw_token: str):
    """
    Tokenni tekshiradi va foydalanuvchini tasdiqlaydi.
    Returns: User object yoki None (noto'g'ri/muddati o'tgan token)
    """
    from .models import EmailVerificationToken

    hashed = _hash_token(raw_token)
    try:
        token_obj = EmailVerificationToken.objects.select_related('user').get(
            token=hashed,
            expires_at__gt=timezone.now(),
        )
    except EmailVerificationToken.DoesNotExist:
        return None

    user = token_obj.user
    user.is_verified = True
    user.save(update_fields=['is_verified'])
    token_obj.delete()
    return user


def resend_verification_email(user) -> bool:
    """
    Tasdiqlash emailini qayta yuboradi.
    Returns: True (yuborildi), False (allaqachon tasdiqlangan)
    """
    if user.is_verified:
        return False
    raw_token = generate_verification_token(user)
    send_verification_email(user, raw_token)
    return True
