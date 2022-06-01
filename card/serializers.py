from rest_framework import serializers
from card.models import Card


class UpdateCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ('text',
                  'color',
                  'label',
                  'created_at',
                  'list',
                  'user',
                  'id',
                  'start_date',
                  'end_date',
                  'details',)

    def validate_details(self, value):
        if len(value) > 500:
            raise serializers.ValidationError('Must be under 500 characters.')
        return value

    def validate(self, data):
        print(data)
        return data

    def update(self, pk, data):
        Card.objects.update(pk, **data)


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
        fields = ('text',
                  'color',
                  'label',
                  'list',
                  'user',
                  'id',
                  'start_date',
                  'end_date',
                  'details',)


class FullCardSerializer(serializers.ModelSerializer):
    list_title = serializers.CharField()

    class Meta:
        model = Card
        fields = ('text',
                  'color',
                  'label',
                  'list',
                  'user',
                  'id',
                  'start_date',
                  'end_date',
                  'details',
                  'list_title',
                  'created_at'
                  )
