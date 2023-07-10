from rest_framework import serializers

from galaxy.models import Image


class ImageSerializer(serializers.ModelSerializer):

    # ticket = serializers.SerializerMethodField()
    class Meta:
        model = Image
        fields = "__all__"
