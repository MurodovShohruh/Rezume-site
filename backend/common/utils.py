import uuid
from slugify import slugify


def generate_unique_slug(title: str, model_class, max_length: int = 100) -> str:
    """
    Unique slug yaratadi. Agar slug mavjud bo'lsa, UUID qo'shadi.

    Args:
        title: Rezume sarlavhasi
        model_class: Django model (Resume)
        max_length: Maksimal uzunlik

    Returns:
        str: Unikal slug
    """
    base_slug = slugify(title)[:max_length - 9]  # UUID prefix uchun joy qoldiramiz

    slug = base_slug
    if model_class.objects.filter(slug=slug).exists():
        slug = f'{base_slug}-{uuid.uuid4().hex[:8]}'

    return slug


def get_client_ip(request) -> str:
    """So'rovdan real IP manzilni oladi (proxy orqali ham)."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '')
