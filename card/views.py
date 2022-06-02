from django.core.exceptions import BadRequest, ObjectDoesNotExist, PermissionDenied
from django.db import DatabaseError
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import FullCardSerializer, UpdateCardSerializer, CreateCardSerializer, CardSerializer
from card.models import Card
from account.permissions import AccountPermission


class DetailAPIView(APIView):
    permissions = [IsAuthenticated, AccountPermission, ]

    def patch(self, request, pk=None):
        try:
            card = Card.objects.get(pk=pk)
            self.check_object_permissions(request, card.user)
            serializer = UpdateCardSerializer(data=request.data['details'])
            if (serializer.is_valid()):
                serializer.update(pk, serializer.validated_data)
                return Response({
                }, status=status.HTTP_200_OK)

            else:
                return Response({
                    'errors': serializer.errors,
                }, status=status.HTTP_400_BAD_REQUEST)

        except (PermissionDenied, Exception) as e:
            print(e)
            return Response({
                'error': 'You do not have permission for this action.'
            }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            card = Card.objects.get(pk=pk)
            self.check_object_permissions(request, card.user)

            Card.objects.delete(pk)
            return Response({
            }, status=status.HTTP_204_NO_CONTENT)

        except (PermissionDenied, Exception):
            return Response({
                'error': 'You do not have permission for this action.'
            }, status=status.HTTP_403_FORBIDDEN)

    def get(self, request, pk=None):
        try:
            card = Card.objects.get(pk=pk)

            self.check_object_permissions(request, card.user)
            card = Card.objects.retreive(int(pk))
            if card is None:
                raise ObjectDoesNotExist
            serializer = FullCardSerializer(card)
            return Response({
                'message': 'success',
                'card': serializer.data
            })
        except ObjectDoesNotExist:
            return Response({
                            'errors': 'errors'
                            }, status=status.HTTP_404_NOT_FOUND)


class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:

            serializer = CreateCardSerializer(data=request.data)

            if serializer.is_valid():

                card = Card.objects.create(serializer.validated_data)
                card_serializer = CardSerializer(card)
                if card is not None:
                    return Response({
                                    'message': 'success',
                                    'card': card_serializer.data,
                                    })
            else:
                return Response({
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except (Exception, BadRequest, ) as e:
            print(e)
            return Response({
                            'message': 'something went wrong.'
                            }, status=status.HTTP_400_BAD_REQUEST)
