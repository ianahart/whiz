from rest_framework import serializers

from list.models import List


class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ('title', 'user', 'space', 'id', )


class CreateListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ('title', 'space', 'user', )

    def validate_title(self, value):
        if (len(value) > 75):
            raise serializers.ValidationError(
                'List title must be maximum 75 characters.')
        return value
