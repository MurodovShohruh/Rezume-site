from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_spectacular.utils import extend_schema
from django.shortcuts import get_object_or_404

from common.responses import success_response, error_response
from common.permissions import IsOwner
from common.pagination import StandardPagination
from .models import Resume
from .serializers import (
    ResumeCreateSerializer, ResumeListSerializer,
    ResumeDetailSerializer, ResumeUpdateSerializer
)
from .services.pdf_service import generate_pdf
from .services.s3_service import upload_pdf


class ResumeListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=['Resume'])
    def get(self, request):
        """Joriy foydalanuvchining barcha rezumelari."""
        resumes = Resume.objects.filter(user=request.user)
        paginator = StandardPagination()
        page = paginator.paginate_queryset(resumes, request)
        serializer = ResumeListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

    @extend_schema(request=ResumeCreateSerializer, tags=['Resume'])
    def post(self, request):
        """Yangi rezume yaratish."""
        serializer = ResumeCreateSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        resume = serializer.save()
        return success_response(
            ResumeDetailSerializer(resume).data,
            status_code=status.HTTP_201_CREATED
        )


class ResumeDetailView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def get_object(self, pk, user):
        return get_object_or_404(Resume, pk=pk, user=user)

    @extend_schema(tags=['Resume'])
    def get(self, request, pk):
        resume = self.get_object(pk, request.user)
        return success_response(ResumeDetailSerializer(resume).data)

    @extend_schema(request=ResumeUpdateSerializer, tags=['Resume'])
    def put(self, request, pk):
        resume = self.get_object(pk, request.user)
        serializer = ResumeUpdateSerializer(resume, data=request.data)
        if not serializer.is_valid():
            return error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return success_response(ResumeDetailSerializer(resume).data)

    @extend_schema(request=ResumeUpdateSerializer, tags=['Resume'])
    def patch(self, request, pk):
        resume = self.get_object(pk, request.user)
        serializer = ResumeUpdateSerializer(resume, data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response(serializer.errors, status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return success_response(ResumeDetailSerializer(resume).data)

    @extend_schema(tags=['Resume'])
    def delete(self, request, pk):
        resume = self.get_object(pk, request.user)
        resume.delete()
        return success_response({'detail': 'Rezume o\'chirildi.'}, status_code=status.HTTP_204_NO_CONTENT)


class ResumeExportPDFView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=['Resume'])
    def post(self, request, pk):
        """Resume uchun PDF yaratadi va S3 ga yuklaydi."""
        resume = get_object_or_404(Resume, pk=pk, user=request.user)

        try:
            pdf_bytes = generate_pdf(resume)
            pdf_url = upload_pdf(pdf_bytes, str(resume.id))
            resume.pdf_url = pdf_url
            resume.save(update_fields=['pdf_url'])
            # PDF yuklashni statistikaga loglash (TZ: PDF yuklashlar soni)
            from apps.statistics.services import log_pdf_download
            log_pdf_download(resume=resume, user=request.user)
            return success_response({'pdf_url': pdf_url})
        except Exception as e:
            return error_response({'detail': f'PDF yaratishda xato: {str(e)}'}, status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResumeTogglePublicView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=['Resume'])
    def patch(self, request, pk):
        """Rezumeni public/private qiladi."""
        resume = get_object_or_404(Resume, pk=pk, user=request.user)
        resume.is_public = not resume.is_public

        if resume.is_public and not resume.slug:
            from common.utils import generate_unique_slug
            resume.slug = generate_unique_slug(resume.title, Resume)

        resume.save(update_fields=['is_public', 'slug'])
        return success_response({
            'is_public': resume.is_public,
            'slug': resume.slug,
            'public_url': f'/api/public/{resume.slug}' if resume.is_public else None,
        })


class PublicResumeView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(tags=['Public'])
    def get(self, request, slug):
        """Slug orqali ochiq rezumeni ko'rish."""
        resume = get_object_or_404(Resume, slug=slug, is_public=True)
        # Ko'rishni statistika servisiga loglash (TZ: IP, vaqt loglanadi)
        from apps.statistics.services import log_resume_view
        from common.utils import get_client_ip
        log_resume_view(
            resume=resume,
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
        )
        serializer = ResumeDetailSerializer(resume)
        return success_response(serializer.data)


class GalleryView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(tags=['Public'])
    def get(self, request):
        """Barcha ochiq rezumeler (V2)."""
        resumes = Resume.objects.filter(is_public=True).order_by('-view_count')
        paginator = StandardPagination()
        page = paginator.paginate_queryset(resumes, request)
        serializer = ResumeListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)
