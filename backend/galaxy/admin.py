from django.contrib import admin
from .models import Image

# Register your models here.


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'megacube', 'mangaid', 'objra', 'objdec',
                    'nsa_iauname', 'mjdmed', 'exptime', 'airmsmed', 'seemed', 'nsa_z',)
