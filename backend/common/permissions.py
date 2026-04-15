from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    """
    Faqat obyekt egasi kirish imkoniga ega.
    Obyektda `user` maydoni bo'lishi kerak.
    """
    message = 'Bu obyektga faqat egasi kirishi mumkin.'

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsVerifiedUser(BasePermission):
    """Faqat email tasdiqlangan foydalanuvchilar uchun."""
    message = 'Email tasdiqlang.'

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_verified)
