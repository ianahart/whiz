from django.core.exceptions import BadRequest, ObjectDoesNotExist
from django.db import DatabaseError
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from list.serializers import CreateListSerializer, ListSerializer
from list.models import List


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
