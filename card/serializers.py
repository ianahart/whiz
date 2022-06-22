from rest_framework import serializers
from card.models import Card
from checklist.serializers import CheckListSerializer


class MoveCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ('list', )

    def validate(self, data):
        return data


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
        if isinstance(value, str) and len(value) > 500:
            raise serializers.ValidationError('Must be under 500 characters.')
        return value

    def validate(self, data):
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
    date_range = serializers.CharField()

    class Meta:
        model = Card
        fields = ('text',
                  'color',
                  'label',
                  'list',
                  'user',
                  'id',
                  'index',
                  'date_range',
                  'start_date',
                  'end_date',
                  'details',)


class FullCardSerializer(serializers.ModelSerializer):
    list_title = serializers.CharField()
    readable_date = serializers.CharField()
    date_range = serializers.CharField()
    card_checklists = CheckListSerializer(many=True)

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
                  'date_range',
                  'list_title',
                  'created_at',
                  'readable_date',
                  'card_checklists',
                  )
