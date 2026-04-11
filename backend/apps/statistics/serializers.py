from rest_framework import serializers


class ResumeStatsSerializer(serializers.Serializer):
    resume_id = serializers.UUIDField()
    title = serializers.CharField()
    view_count = serializers.IntegerField()
    pdf_download_count = serializers.IntegerField()
    is_public = serializers.BooleanField()
    created_at = serializers.DateTimeField()


class UserStatsSerializer(serializers.Serializer):
    total_resumes = serializers.IntegerField()
    public_resumes = serializers.IntegerField()
    total_views = serializers.IntegerField()
    total_pdf_downloads = serializers.IntegerField()
    resumes = ResumeStatsSerializer(many=True)
