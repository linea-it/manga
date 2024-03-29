from django.contrib import admin

from .models import Activity, Visit


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = (
        "owner",
        "event",
        "date",
    )
    list_display_links = (
        "owner",
        "event",
        "date",
    )
    search_fields = ["owner__username", "event", "date"]


@admin.register(Visit)
class VisitAdmin(admin.ModelAdmin):
    list_display = (
        "owner",
        "date",
    )
    list_display_links = (
        "owner",
        "date",
    )
    search_fields = ["owner__username", "date"]
