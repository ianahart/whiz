from rest_framework import serializers
from space.models import Space
import re


class SearchSpaceSerializer(serializers.Serializer):
    search_term = serializers.CharField()

    def validate_search_term(self, data):
        pattern = re.compile(r'^[\w ]+$')
        match = re.fullmatch(pattern, data)
        if not match:
            raise serializers.ValidationError(
                'Please use only letters, numbers and spaces')
        return data


class UpdateSpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Space
        fields = ('title',
                  'id',
                  'color',
                  'background',
                  'thumbnail',
                  'has_background',
                  'is_starred',
                  )

    def validate_title(self, value):
        if len(value) == 0 or len(value) > 125:
            raise serializers.ValidationError(
                'List title has a maximum of 125 characters.')
        return value


class SpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Space
        fields = ('id', 'title', 'color', 'background',
                  'has_background', 'thumbnail', 'is_starred', )
        read_only_fields = ['id']


class CreateSpaceSerializer(serializers.ModelSerializer):
    background = serializers.CharField()
    thumbnail = serializers.CharField(allow_blank=True)

    class Meta:
        model = Space
        fields = ('background', 'title', 'thumbnail', )
