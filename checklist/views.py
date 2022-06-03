from django.core.exceptions import BadRequest, ObjectDoesNotExist, PermissionDenied
from django.db import DatabaseError
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from checklist.models import CheckListItem
from account.permissions import AccountPermission
from checklist.serializers import UpdateCheckListItemSerializer, CheckListItemSerializer, CheckListSerializer, CreateCheckListItemSerializer, CreateCheckListSerializer


class DetailListItemItemAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def patch(self, request, pk=None):
        try:
            list_item = CheckListItem.objects.get(pk=pk)
            self.check_object_permissions(request, list_item.user)

            serializer = UpdateCheckListItemSerializer(data=request.data)

            if serializer.is_valid():
                CheckListItem.objects.update_complete(serializer.data, pk)
                return Response({
                    'message': 'success'
                }, status=status.HTTP_200_OK)
            else:
                raise BadRequest
        except (Exception, BadRequest, PermissionDenied, ) as e:
            return Response({
                'message': 'Something went wrong.'
            }, status=status.HTTP_400_BAD_REQUEST)


class ListCreateListItemAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:

            create_serializer = CreateCheckListItemSerializer(
                data=request.data)

            if create_serializer.is_valid():
                checklist = create_serializer.create(
                    validated_data=create_serializer.validated_data)
                if checklist is None:
                    raise BadRequest('Unable to add list item')

                get_serializer = CheckListItemSerializer(checklist)

                return Response({
                                'message': 'success',
                                'checklist_item': get_serializer.data,
                                })
            else:
                return Response({
                                'errors': create_serializer.errors,
                                }, status=status.HTTP_400_BAD_REQUEST)
        except (Exception, BadRequest, ) as e:
            return Response({
                            'message': 'something went wrong.'
                            }, status=status.HTTP_400_BAD_REQUEST)


class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:

            create_serializer = CreateCheckListSerializer(data=request.data)

            if create_serializer.is_valid():
                checklist = create_serializer.create(
                    validated_data=create_serializer.validated_data)
                if checklist is None:
                    raise BadRequest('Unable to add list')

                get_serializer = CheckListSerializer(checklist)

                return Response({
                                'message': 'success',
                                'checklist': get_serializer.data,
                                })
            else:
                return Response({
                                'errors': create_serializer.errors,
                                }, status=status.HTTP_400_BAD_REQUEST)
        except (Exception, BadRequest, ):
            return Response({
                            'message': 'something went wrong.'
                            }, status=status.HTTP_400_BAD_REQUEST)
