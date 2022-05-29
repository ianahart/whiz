from rest_framework import serializers
from space.models import Space


class UpdateSpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Space
        fields = ('title', )

    def validate_title(self, value):
        if len(value) == 0 or len(value) > 125:
            raise serializers.ValidationError(
                'List title has a maximum of 125 characters.')
        return value


class SpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Space
        fields = ('id', 'title', 'color', 'background',
                  'has_background', 'thumbnail', )
        read_only_fields = ['id']


class CreateSpaceSerializer(serializers.ModelSerializer):
    background = serializers.CharField()
    thumbnail = serializers.CharField(allow_blank=True)

    class Meta:
        model = Space
        fields = ('background', 'title', 'thumbnail', )
