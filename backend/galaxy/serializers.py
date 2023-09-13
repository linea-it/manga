from rest_framework import serializers

from galaxy.models import Image
import posixpath
from django.conf import settings


class ImageSerializer(serializers.ModelSerializer):

    sdss_image = serializers.SerializerMethodField()

    class Meta:
        model = Image
        # fields = "__all__"
        exclude = (
            "had_parts_extracted", 
            "path", "bcomp_path", "folder_name")

    def get_sdss_image(self, obj):
        # Join and make the url for the sdss image:
        file_url = posixpath.join(
            settings.MEGACUBE_PARTS_URL, obj.folder_name, "sdss_image.jpg")

        return file_url
