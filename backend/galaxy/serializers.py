from rest_framework import serializers

from galaxy.models import Image


class ImageSerializer(serializers.ModelSerializer):

    # ticket = serializers.SerializerMethodField()
    class Meta:
        model = Image
        fields = (
            'id',
            'megacube',
            'mangaid',
            'objra',
            'objdec',
            'nsa_iauname',
            'mjdmed',
            'exptime',
            'airmsmed',
            'seemed',
            'nsa_z',
            # 'nsa_sersic_absmag',
            # 'nsa_elpetro_absmag',
        )
