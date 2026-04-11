from django.contrib import admin
from .models import ResumeView, PDFDownload


@admin.register(ResumeView)
class ResumeViewAdmin(admin.ModelAdmin):
    list_display = ('resume', 'ip_address', 'viewed_at')
    list_filter = ('viewed_at',)
    readonly_fields = ('id', 'viewed_at')


@admin.register(PDFDownload)
class PDFDownloadAdmin(admin.ModelAdmin):
    list_display = ('resume', 'user', 'downloaded_at')
    list_filter = ('downloaded_at',)
    readonly_fields = ('id', 'downloaded_at')
