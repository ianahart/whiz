from django.core.exceptions import BadRequest, ObjectDoesNotExist
from django.db import DatabaseError
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import CreateCardSerializer, CardSerializer
from card.models import Card
from account.permissions import AccountPermission


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
