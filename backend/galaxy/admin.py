from django.contrib import admin
from .models import Image

# Register your models here.


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'megacube', 'mangaid', 'objra', 'objdec', 'had_parts_extracted', 'had_bcomp')
