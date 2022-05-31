from rest_framework import serializers
from card.serializers import CardSerializer

from list.models import List


class UpdateCoordSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ('x_coordinate', 'y_coordinate', )


class UpdateListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ('title', )

    def validate_title(self, value):
        if len(value) == 0 or len(value) > 75:
            raise serializers.ValidationError(
                'List title has a maximum of 75 characters.')
        return value


class ListSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)

    class Meta:
        model = List
        fields = ('title',  'cards', 'user', 'space', 'id',
                  'x_coordinate', 'y_coordinate', )


class CreateListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ('title', 'space', 'user', )

    def validate_title(self, value):
        if len(value) > 75:
            raise serializers.ValidationError(
                'List title must be maximum 75 characters.')
        if len(value.strip()) == 0:
            raise serializers.ValidationError('Please provide a list title.')
        return value
