from rest_framework import serializers

from .models import CustomUser



class UserSerializer(serializers.ModelSerializer):
    email = serializers.CharField()
    initials = serializers.SerializerMethodField()
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = CustomUser
        fields = (
            'email',
            'id',
            'first_name',
            'logged_in',
            'avatar_url',
            'initials',
            'full_name'
        )

    def get_initials(self, obj):
        obj.first_name[0:1]
        return obj.first_name[0:1].upper() + '' + obj.last_name[0:1].upper()
