import logging
logger = logging.getLogger('django')
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import hashers
from django.db import models, DatabaseError
from rest_framework_simplejwt.backends import TokenBackend
from django.contrib.auth.models import BaseUserManager, AbstractUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from datetime import datetime, timedelta, date

class CustomUserManager(BaseUserManager):

    def create(self, email:str, password: str, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, password=password, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    def create_superuser(self, email: str, password: str, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create(email, password, **extra_fields)



    def user_by_token(self, user: 'CustomUser', token: str):
        """
            get the user by header token.
        """
        decoded_token = None
        try:
            decoded_token = TokenBackend(
                algorithm='HS256'
            ).decode(token.split('Bearer ')[1], verify=False)

        except IndexError:
            logger.error('Malformed token inside get user by token')

        if decoded_token is not None:
            obj = CustomUser.objects.get(pk=decoded_token['user_id'])

            return None if obj.pk != user.pk else obj

    def user_by_email(self, email: str):
        """
            get the user by their email.
        """
        try:
            return CustomUser.objects.all().filter(email=email).first()
        except DatabaseError:
            logger.error('Unable to retrieve user by email.')




    def logout(self, data: dict[str, str | int]):
        """
            logout the user and blacklist their refresh token.
        """
        user = CustomUser.objects.get(pk=data['id'])
        user.logged_in = False
        user.save()

        token = RefreshToken(data['refresh_token'])
        token.blacklist()


    def login(self, validated_data: dict[str, str], user: 'CustomUser'):
        """
            login user and verify user, return an access and refresh token
        """
        try:
            valid = hashers.check_password(validated_data['password'], user.password)

            if not valid:
                return {}

            refresh_token = RefreshToken.for_user(user)
            access_token = refresh_token.access_token

            user.logged_in = True
            user.save()
            user.refresh_from_db()

            access_token.set_exp(lifetime=timedelta(days=3))

            return {
                'access_token': str(access_token),
                'refresh_token': str(refresh_token)
            }
        except TokenError:
            logger.error('Unable to log user in.')



class CustomUser(AbstractUser, PermissionsMixin):
    username = None
    logged_in = models.BooleanField(default=False)
    avatar_file = models.TextField(max_length=500, blank=True, null=True)
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    password_strength = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    name = models.CharField(unique=True, max_length=200, blank=True, null=True)
    first_name = models.CharField(max_length=200, blank=True, null=True)
    last_name = models.CharField(max_length=200, blank=True, null=True)
    email = models.EmailField(_(
                            'email address'),
                              unique=True,
                              blank=True,
                              null=True,
                              error_messages={'unique':
                                  'A user with this email already exists.'
                              }
                              )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects: CustomUserManager = CustomUserManager()

    def __str__(self):
        return f"{self.email}"

    def set_logged_in(self, logged_in: bool) -> None:
        if isinstance(logged_in, bool):

            self.logged_in = logged_in
            self.save()

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'

