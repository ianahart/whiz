from rest_framework import serializers
from card.models import Card


class CreateCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ('color', 'label', 'text', 'space', 'list', 'user', )

    def validate_text(self, value):
        if len(value) > 75:
            raise serializers.ValidationError('Must be under 75 characters.')
        return value


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ('text', 'color', 'label', 'list', 'user', 'id', )
