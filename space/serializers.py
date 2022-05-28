from rest_framework import serializers
from space.models import Space


class SpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Space
        fields = ('id', 'title', 'color', 'background', 'has_background', 'thumbnail', )
        read_only_fields = ['id']


class CreateSpaceSerializer(serializers.ModelSerializer):
    background = serializers.CharField()
    thumbnail = serializers.CharField(allow_blank=True)

    class Meta:
        model = Space
        fields = ('background', 'title', 'thumbnail', )
