from rest_framework import serializers


from checklist.models import CheckListItem, Checklist


class CheckListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckListItem
        fields = ('id', 'user', 'card', 'checklist', 'is_complete', 'title', )


class UpdateCheckListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckListItem
        fields = ('is_complete', )


class CreateCheckListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckListItem
        fields = ('title', 'checklist', 'user', 'card', )

    def create(self, validated_data):
        return CheckListItem.objects.create(validated_data)


class CheckListSerializer(serializers.ModelSerializer):
    checklist_checklist_items = CheckListItemSerializer(many=True)

    class Meta:
        model = Checklist
        fields = ('checklist_checklist_items', 'title',
                  'is_complete', 'user', 'card', 'id',)


class CreateCheckListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Checklist
        fields = ('title', 'card', 'user', )

    def create(self, validated_data):
        return Checklist.objects.create(validated_data)
