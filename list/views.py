from django.core.exceptions import BadRequest, ObjectDoesNotExist, PermissionDenied
from django.db import DatabaseError
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from card.serializers import CardSerializer
from list.serializers import CreateListSerializer, ListSerializer, UpdateListSerializer, UpdateCoordSerializer
from list.models import List
from card.models import Card
from account.permissions import AccountPermission


class ListCardsAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request, pk=None):
        try:
            if pk is None:
                raise ObjectDoesNotExist
            cards = Card.objects.retreive_all(pk)
            serializer = CardSerializer(cards, many=True)

            return Response({
                            'message': 'success',
                            'cards': serializer.data,
                            }, status=status.HTTP_200_OK)

        except ObjectDoesNotExist as e:
            print(e)
            return Response({
                            'errors': 'erorrs'
                            }, status=status.HTTP_404_NOT_FOUND)


class CoordsAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def patch(self, request, pk=None):
        try:
            print(request.data)
            exists = List.objects.get(pk=pk)
            self.check_object_permissions(request, exists.user)

            serializer = UpdateCoordSerializer(data=request.data)
            if serializer.is_valid():
                List.objects.update_coords(data=serializer.data, pk=pk)
                return Response({
                                'message': 'success'
                                })
            else:
                raise BadRequest
        except (Exception, BadRequest, ) as e:
            print(e)
            return Response({
                            'message': 'something went wrong.'
                            }, status=status.HTTP_400_BAD_REQUEST)


class DetailAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def delete(self, request, pk=None):
        try:

            list = List.objects.get(pk=pk)
            self.check_object_permissions(request, list.user)

            list.delete()

            return Response({

            }, status=status.HTTP_204_NO_CONTENT)
        except (PermissionDenied) as e:
            return Response({
                'error': 'You do not have permission for this action.'
            }, status=status.HTTP_403_FORBIDDEN)

    def patch(self, request, pk=None):
        try:
            exists = List.objects.get(pk=pk)
            self.check_object_permissions(request, exists.user)

            serializer = UpdateListSerializer(data=request.data)
            if serializer.is_valid():
                List.objects.update(data=serializer.data, pk=pk)
                return Response({
                                'message': 'success'
                                })
            else:
                raise BadRequest
        except (Exception, BadRequest, ):
            return Response({
                            'message': 'something went wrong.'
                            }, status=status.HTTP_400_BAD_REQUEST)


class ListCreateAPIView(APIView):
    permissions_classes = [IsAuthenticated, ]

    def get(self, request, pk=None):
        try:

            return Response({
                            'message': 'success',
                            }, status=status.HTTP_200_OK)

        except ObjectDoesNotExist as e:
            print(e)
            return Response({
                            'errors': 'erorrs'
                            }, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):

        try:
            serializer = CreateListSerializer(data=request.data)

            if serializer.is_valid():
                list = List.objects.create(serializer.validated_data)
                serializer = ListSerializer(list)
                if isinstance(list, dict):
                    raise BadRequest(list['error'])
                return Response({
                                'message': 'success',
                                'list': serializer.data
                                }, status=status.HTTP_200_OK)
            return Response({
                'errors': serializer.errors,
            }, status=status.HTTP_400_BAD_REQUEST)
        except BadRequest as e:
            return Response({
                'errors': {'title': [str(e)]},
            }, status=status.HTTP_400_BAD_REQUEST)
