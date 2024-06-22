from django import forms
from django.contrib import admin
from django.urls import path, reverse
from django.utils.html import mark_safe, format_html
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from cloudinary.forms import CloudinaryFileField
from .models import (
    User, Tag, Journey, Comment, JoinJourney, Rating, Report,
    ImageJourney, CommentImageJourney, PlaceVisit, ActivityLog
)
from django.db import models
from django.http import HttpResponse


class MyAdminSite(admin.AdminSite):
    site_header = 'Quản lý hành trình'
    site_title = 'Custom Admin'
    index_title = 'Custom Admin Dashboard'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('report-stats/', self.admin_view(self.report_stats_view), name='report-stats'),
        ]
        return custom_urls + urls

    def report_stats_view(self, request):
        report_stats = (
            User.objects
            .annotate(report_count=models.Count('reported_reports'))
            .filter(report_count__gt=0)
        )
        html = '<h1>Report Statistics</h1><table><thead><tr><th>User</th><th>Report Count</th></tr></thead><tbody>'
        for user in report_stats:
            html += f'<tr><td>{user.username}</td><td>{user.report_count}</td></tr>'
        html += '</tbody></table>'
        return HttpResponse(html)

    def each_context(self, request):
        context = super().each_context(request)
        context['additional_links'] = format_html('<a href="{}">Report Statistics</a>', reverse('admin:report-stats'))
        return context


admin_site = MyAdminSite(name='myadmin')


class UserAdmin(admin.ModelAdmin):
    list_display = ['pk', 'last_name', 'first_name', 'username', 'role', 'is_active', 'report_count', 'report_reasons', 'view_reports_link']
    search_fields = ['last_name', 'first_name', 'username', 'role']
    list_filter = ['last_name', 'first_name', 'username', 'role']
    actions = ['deactivate_users']

    def deactivate_users(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, "Selected users have been deactivated.")
    deactivate_users.short_description = "Deactivate selected users"

    def report_count(self, obj):
        return obj.reported_reports.count()
    report_count.short_description = 'Report Count'

    def report_reasons(self, obj):
        reports = obj.reported_reports.all()
        reasons = [report.reason for report in reports if report.reason]
        return ', '.join(reasons)
    report_reasons.short_description = 'Report Reasons'

    def view_reports_link(self, obj):
        url = reverse('admin:report-stats')
        return format_html('<a href="{}">View Reports</a>', url)
    view_reports_link.short_description = 'Reports'

class TagAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name', 'created_date', 'updated_date']
    search_fields = ['name']
    list_filter = ['name']

class JourneyForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorUploadingWidget())
    main_image = CloudinaryFileField()

    class Meta:
        model = Journey
        fields = '__all__'

class TagInlineAdmin(admin.StackedInline):
    model = Journey.tags.through

class JourneyAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name', 'user_journey', 'start_date', 'end_date', 'is_completed', 'comments_closed']
    search_fields = ['name', 'description', 'user_journey__username']
    list_filter = ['is_completed', 'comments_closed', 'tags']
    inlines = [TagInlineAdmin]
    readonly_fields = ['main_image_preview']
    form = JourneyForm

    def main_image_preview(self, obj):
        if obj.main_image:
            return mark_safe(f'<img src="{obj.main_image.url}" width="120"/>')
        return ""

class CommentAdmin(admin.ModelAdmin):
    list_display = ['pk', 'user', 'journey', 'cmt', 'is_deleted', 'created_date', 'updated_date']
    search_fields = ['cmt', 'user__username', 'journey__name']
    list_filter = ['is_deleted']

class JoinJourneyAdmin(admin.ModelAdmin):
    list_display = ['pk', 'user', 'journey', 'created_date', 'updated_date']
    search_fields = ['user__username', 'journey__name']

class RatingAdmin(admin.ModelAdmin):
    list_display = ['pk', 'user', 'journey', 'rate', 'content', 'created_date', 'updated_date']
    search_fields = ['user__username', 'journey__name', 'content']
    list_filter = ['rate']

class ReportAdmin(admin.ModelAdmin):
    list_display = ('reporter', 'reported_user', 'reason', 'created_date', 'active')
    list_filter = ('active', 'created_date')
    search_fields = ('reporter__username', 'reported_user__username', 'reason')

    actions = ['deactivate_user']

    def deactivate_user(self, request, queryset):
        for report in queryset:
            report.reported_user.is_active = False
            report.reported_user.save()
        self.message_user(request, "Selected users have been deactivated.")
    deactivate_user.short_description = "Deactivate reported users"

class ImageJourneyAdmin(admin.ModelAdmin):
    list_display = ['pk', 'user', 'journey', 'content', 'created_date', 'updated_date']
    search_fields = ['user__username', 'journey__name', 'content']

class PlaceVisitAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name', 'latitude', 'longitude', 'journey', 'timestamp', 'address']
    search_fields = ['name', 'journey__name', 'address']
    list_filter = ['timestamp']

class ReportStatsAdmin(admin.ModelAdmin):
    change_list_template = "admin/report_stats.html"

    def changelist_view(self, request, extra_context=None):
        report_stats = (
            User.objects
            .annotate(report_count=models.Count('reported_reports'))
            .filter(report_count__gt=0)
        )

        extra_context = {
            'report_stats': report_stats,
        }
        return super().changelist_view(request, extra_context=extra_context)

admin_site.register(Journey, JourneyAdmin)
admin_site.register(User, UserAdmin)
admin_site.register(Tag, TagAdmin)
admin_site.register(Comment, CommentAdmin)
admin_site.register(JoinJourney, JoinJourneyAdmin)
admin_site.register(Rating, RatingAdmin)
admin_site.register(Report, ReportAdmin)
admin_site.register(ImageJourney, ImageJourneyAdmin)
admin_site.register(PlaceVisit, PlaceVisitAdmin)

admin.site = admin_site
