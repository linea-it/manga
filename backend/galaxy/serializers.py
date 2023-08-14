from rest_framework import serializers

from galaxy.models import Image


class ImageSerializer(serializers.ModelSerializer):

    had_bcomp = serializers.SerializerMethodField()
    class Meta:
        model = Image
        fields = "__all__"

    def get_had_bcomp(self, obj):
        return str(obj.had_bcomp)