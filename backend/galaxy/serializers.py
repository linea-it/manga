from rest_framework import serializers

from galaxy.models import Image


class ImageSerializer(serializers.ModelSerializer):

    # ticket = serializers.SerializerMethodField()
    class Meta:
        model = Image
        fields = (
            'id',
            'megacube',
            'plateifu',
            'mangaid',
            'objra',
            'objdec',
            'harname',
            'cenra',
            'cendec',
            'platetyp',
        )
