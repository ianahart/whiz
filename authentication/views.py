from rest_framework.exceptions import PermissionDenied
from django.core.exceptions import BadRequest, ObjectDoesNotExist
from django.db import DatabaseError
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import permission_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from account.permissions import AccountPermission
from account.models import CustomUser
from account.serializers import UserSerializer
from authentication.models import PasswordReset
from .serializers import RegisterSerializer, ForgotPasswordSerializer, LoginSerializer, LogoutSerializer


class ResetPasswordAPIView(APIView):
    permission_classes = [AllowAny, ]

    def patch(self, request, pk=None):
        try:

            result = PasswordReset.objects.reset_password(
                data=request.data, user_id=pk)
            if result is not None and result['type'] == 'error':
                raise BadRequest(result['error'])
            if result is not None:
                data = CustomUser.objects.update_password(result['new_password'],
                                                          pk)
                if data is not None and data['type'] == 'error':
                    raise BadRequest(data['error'])

            return Response({
                'message': 'success'
            }, status=status.HTTP_200_OK)

        except BadRequest as e:
            return Response({
                            'errors': str(e)
                            }, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordAPIView(APIView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        try:
            serializer = ForgotPasswordSerializer(data=request.data)

            if serializer.is_valid():
                data = CustomUser.objects.forgot_password(
                    serializer.validated_data)
                if data['type'] == 'error':
                    raise ObjectDoesNotExist(data['data'])

                user = CustomUser.objects.get(
                    pk=data['data']['uid'])  # type:ignore
                PasswordReset.objects.create(data, user)

                return Response({
                                'message': 'success',
                                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except (BadRequest, ObjectDoesNotExist, ) as e:
            return Response({
                            'errors': {'email': [str(e)]}
                            }, status=status.HTTP_400_BAD_REQUEST)


class LogoutAPIView(APIView):
    """
        A View for logging out a user.
    """
    permissions = [IsAuthenticated, ]

    def post(self, request):
        try:
            serializer = LogoutSerializer(data=request.data)
            if serializer.is_valid():
                try:
                    CustomUser.objects.logout(serializer.data)
                    return Response({
                        'message': 'user logged out successfully.',
                    },
                        status=status.HTTP_200_OK)

                except TokenError:
                    raise PermissionDenied
            else:
                return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except PermissionDenied as e:
            print(e)
            return Response(
                {'message': 'token blacklisted.'},
                status=status.HTTP_403_FORBIDDEN
            )


class TokenObtainPairView(APIView):
    permission_classes = [AllowAny, ]

    def post(self, request):
        try:

            serializer = LoginSerializer(data=request.data)
            if serializer.is_valid() and serializer.validated_data:

                user = CustomUser.objects.user_by_email(
                    email=serializer.validated_data['email'])

                if user is None:
                    raise ObjectDoesNotExist(
                        'A user with that email does not exist.')

                tokens = CustomUser.objects.login(
                    serializer.validated_data, user)
                if not bool(tokens):
                    raise BadRequest('Credentials are invalid.')

                user_serializer = UserSerializer(user)
                return Response({
                    'message': 'success',
                    'tokens': tokens,
                    'user': user_serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except (BadRequest, ObjectDoesNotExist, ) as e:
            status_code, error = 404, ''
            if isinstance(e, ObjectDoesNotExist):
                error = str(e)
            if isinstance(e, BadRequest):
                error = {'email': [str(e)]}
                status_code = 400

            return Response({
                'errors': error
            }, status=status_code)


class RegisterAPIView(APIView):
    """
       A View for creating/registering a user.
    """
    permission_classes = [AllowAny, ]

    def post(self, request):
        """
            A Method that handles the creation of a new user.
        """
        try:
            serializer = RegisterSerializer(data=request.data)
            if serializer.is_valid():
                serializer.create(validated_data=serializer.validated_data)
                return Response({
                    'message': 'success'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'message': 'Something went wrong'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
