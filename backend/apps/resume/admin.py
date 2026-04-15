from django.contrib import admin
from .models import Resume


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'template_id', 'language', 'is_public', 'view_count', 'created_at')
    list_filter = ('template_id', 'language', 'is_public')
    search_fields = ('title', 'user__email', 'slug')
    readonly_fields = ('id', 'view_count', 'created_at', 'updated_at')
    ordering = ('-created_at',)

    fieldsets = (
        (None, {'fields': ('id', 'user', 'title', 'template_id', 'language')}),
        ('Ma\'lumotlar', {'fields': ('data', 'ai_content')}),
        ('Holat', {'fields': ('is_public', 'slug', 'pdf_url', 'view_count')}),
        ('Vaqt', {'fields': ('created_at', 'updated_at')}),
    )
