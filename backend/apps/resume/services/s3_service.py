"""
AWS S3 / Cloudflare R2 fayl saqlash servisi.
"""
import boto3
import uuid
from django.conf import settings


def get_s3_client():
    return boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_S3_REGION_NAME,
    )


def upload_pdf(pdf_bytes: bytes, resume_id: str) -> str:
    """
    PDF faylni S3 ga yuklaydi va public URL qaytaradi.

    Args:
        pdf_bytes: PDF fayl content (bytes)
        resume_id: Resume UUID (fayl nomi uchun)

    Returns:
        str: S3 URL
    """
    client = get_s3_client()
    key = f'pdfs/{resume_id}/{uuid.uuid4().hex}.pdf'

    client.put_object(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Key=key,
        Body=pdf_bytes,
        ContentType='application/pdf',
        ContentDisposition='inline',
    )

    url = f'https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{key}'
    return url


def upload_avatar(image_bytes: bytes, user_id: str, content_type: str = 'image/jpeg') -> str:
    """
    Foydalanuvchi avatar rasmini S3 ga yuklaydi.
    """
    client = get_s3_client()
    ext = content_type.split('/')[-1]
    key = f'avatars/{user_id}/{uuid.uuid4().hex}.{ext}'

    client.put_object(
        Bucket=settings.AWS_STORAGE_BUCKET_NAME,
        Key=key,
        Body=image_bytes,
        ContentType=content_type,
    )

    url = f'https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{key}'
    return url


def delete_file(url: str) -> None:
    """S3 dan faylni o'chiradi."""
    if not url:
        return
    try:
        # URLdan key ni ajratib olamiz
        bucket = settings.AWS_STORAGE_BUCKET_NAME
        key = url.split(f'{bucket}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/')[-1]
        client = get_s3_client()
        client.delete_object(Bucket=bucket, Key=key)
    except Exception:
        pass
