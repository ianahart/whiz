from rest_framework import serializers

from account.models import CustomUser


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    class Meta:
        fields = ('email', )

    def validate(self, data):
        return data


class LogoutSerializer(serializers.ModelSerializer):
    refresh_token = serializers.CharField()
    id = serializers.IntegerField()

    class Meta:
        model = CustomUser
        fields = ('id', 'refresh_token', )


class LoginSerializer(serializers.ModelSerializer):
    email = serializers.CharField()

    class Meta:
        model = CustomUser
        fields = ('email', 'password', )
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if len(value) == 0:
            raise serializers.ValidationError('Email may not be empty.')
        return value

    def validate_password(self, value):
        if len(value) == 0:
            raise serializers.ValidationError('Password may not be empty.')
        return value


class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField()

    class Meta:
        model = CustomUser
        fields = ('first_name',
                  'last_name',
                  'email',
                  'password',
                  'confirm_password',
                  )
        read_only_fields = ['confirm_password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_first_name(self, value: str):
        return value.capitalize()

    def validate_last_name(self, value: str):
        return value.capitalize()

    def validate(self, attrs):
        """
            Check to see if password and confirm password match.
        """
        if attrs['confirm_password'] != attrs['password']:
            raise serializers.ValidationError(
                dict(password=['Passwords do not match.']))
        return attrs

    def create(self, validated_data):
        """
            Calls create method inside account model
        """
        exclude = ['confirm_password', 'email', 'password']
        data = {k: validated_data[k]
                for k in validated_data if k not in exclude}

        CustomUser.objects.create(
            email=validated_data['email'],
            password=validated_data['password'],
            **data)
