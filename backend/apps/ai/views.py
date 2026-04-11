from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from django.shortcuts import get_object_or_404

from common.responses import success_response, error_response
from apps.resume.models import Resume
from .services.claude_service import optimize_resume, generate_cover_letter, analyze_ats


class GenerateAIView(APIView):
    """Resume matnini Claude AI bilan optimallashtiradi."""
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=['AI'])
    def post(self, request, pk):
        resume = get_object_or_404(Resume, pk=pk, user=request.user)

        if not resume.data:
            return error_response(
                {'detail': 'Resume ma\'lumotlari bo\'sh. Avval ma\'lumot kiriting.'},
                status.HTTP_400_BAD_REQUEST
            )

        try:
            ai_content = optimize_resume(resume.data, resume.language)
            resume.ai_content = ai_content
            resume.save(update_fields=['ai_content'])

            return success_response({
                'ai_content': ai_content,
                'message': 'AI muvaffaqiyatli generatsiya qildi.',
            })
        except Exception as e:
            return error_response(
                {'detail': f'AI xatosi: {str(e)}'},
                status.HTTP_502_BAD_GATEWAY
            )


class CoverLetterView(APIView):
    """Resume asosida motivatsion xat yaratadi (V2)."""
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=['AI'])
    def post(self, request, pk):
        resume = get_object_or_404(Resume, pk=pk, user=request.user)
        job_title = request.data.get('job_title', '')
        company_name = request.data.get('company_name', '')

        if not job_title or not company_name:
            return error_response(
                {'detail': 'job_title va company_name majburiy.'},
                status.HTTP_400_BAD_REQUEST
            )

        try:
            cover_letter = generate_cover_letter(
                resume.data, job_title, company_name, resume.language
            )
            return success_response({'cover_letter': cover_letter})
        except Exception as e:
            return error_response({'detail': str(e)}, status.HTTP_502_BAD_GATEWAY)


class ATSAnalysisView(APIView):
    """Resumeni ATS uchun tahlil qiladi (V2)."""
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=['AI'])
    def post(self, request, pk):
        resume = get_object_or_404(Resume, pk=pk, user=request.user)
        job_description = request.data.get('job_description', '')

        try:
            result = analyze_ats(resume.data, job_description)
            return success_response(result)
        except Exception as e:
            return error_response({'detail': str(e)}, status.HTTP_502_BAD_GATEWAY)
