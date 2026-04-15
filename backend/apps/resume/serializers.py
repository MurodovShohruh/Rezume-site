from rest_framework import serializers
from .models import Resume


class ResumeDataSerializer(serializers.Serializer):
    """Resume data JSONB maydoni validatsiyasi."""

    class PersonalSerializer(serializers.Serializer):
        fullName = serializers.CharField(max_length=100)
        email = serializers.EmailField()
        phone = serializers.CharField(max_length=20)
        city = serializers.CharField(max_length=100)
        linkedin = serializers.URLField(required=False, allow_null=True)
        github = serializers.URLField(required=False, allow_null=True)
        portfolio = serializers.URLField(required=False, allow_null=True)
        summary = serializers.CharField(required=False, allow_blank=True)

    class ExperienceSerializer(serializers.Serializer):
        company = serializers.CharField(max_length=150)
        position = serializers.CharField(max_length=150)
        startDate = serializers.CharField(max_length=7)   # YYYY-MM
        endDate = serializers.CharField(max_length=7, required=False, allow_null=True)
        isCurrent = serializers.BooleanField(default=False)
        description = serializers.CharField(allow_blank=True)

    class EducationSerializer(serializers.Serializer):
        institution = serializers.CharField(max_length=200)
        degree = serializers.CharField(max_length=100)
        field = serializers.CharField(max_length=100)
        startYear = serializers.IntegerField()
        endYear = serializers.IntegerField(required=False, allow_null=True)

    class LanguageSerializer(serializers.Serializer):
        LEVEL_CHOICES = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native']
        name = serializers.CharField(max_length=50)
        level = serializers.ChoiceField(choices=LEVEL_CHOICES)

    class CertificateSerializer(serializers.Serializer):
        name = serializers.CharField(max_length=200)
        issuer = serializers.CharField(max_length=200)
        date = serializers.CharField(max_length=7)  # YYYY-MM

    personal = PersonalSerializer()
    experience = ExperienceSerializer(many=True, required=False, default=list)
    education = EducationSerializer(many=True, required=False, default=list)
    skills = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    languages = LanguageSerializer(many=True, required=False, default=list)
    certificates = CertificateSerializer(many=True, required=False, default=list)


class ResumeCreateSerializer(serializers.ModelSerializer):
    data = ResumeDataSerializer()

    class Meta:
        model = Resume
        fields = ('title', 'template_id', 'data', 'language')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ResumeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ('id', 'title', 'template_id', 'language', 'is_public', 'view_count',
                  'pdf_url', 'slug', 'created_at', 'updated_at')


class ResumeDetailSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = ('id', 'title', 'template_id', 'data', 'ai_content', 'language',
                  'is_public', 'slug', 'pdf_url', 'view_count', 'owner',
                  'created_at', 'updated_at')

    def get_owner(self, obj):
        return {'id': str(obj.user.id), 'full_name': obj.user.full_name}


class ResumeUpdateSerializer(serializers.ModelSerializer):
    data = ResumeDataSerializer(required=False)

    class Meta:
        model = Resume
        fields = ('title', 'template_id', 'data', 'language', 'is_public')
