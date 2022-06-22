from django.shortcuts import render

from django.core.exceptions import BadRequest, ObjectDoesNotExist
from django.db import DatabaseError
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from account.models import CustomUser
from account.permissions import AccountPermission
from account.serializers import UserSerializer


class DetailAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def delete(self, request, pk=None):

        try:
            user = CustomUser.objects.get(pk=pk)
            if user:
                self.check_object_permissions(request, user)

                refresh_token = RefreshToken(request.query_params['token'])
                refresh_token.blacklist()

                user.delete()

                return Response({
                    'message': 'success'
                }, status=status.HTTP_200_OK)
            else:
                raise BadRequest(
                    'Something went wrong. Please try again soon.')
        except BadRequest as e:
            return Response({
                            'errors': str(e)
                            }, status=status.HTTP_400_BAD_REQUEST)


class RetreiveUserAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def get(self, request):
        try:
            user = CustomUser.objects.user_by_token(
                user=request.user,
                token=request.headers['authorization'])

            if user is None:
                raise BadRequest

            serializer = UserSerializer(user)
            self.check_object_permissions(request, user)
            return Response({
                'message': 'success',
                'user': serializer.data
            }, status=status.HTTP_200_OK)
        except (BadRequest, ObjectDoesNotExist, ) as e:
            status_code, error = 400, ''

            return Response({
                'errors': str(e)
            }, status=status_code)
