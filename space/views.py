from django.core.exceptions import BadRequest, ObjectDoesNotExist
from django.db import DatabaseError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from space.models import Space
from .services import Pexels
from space.serializers import CreateSpaceSerializer, SpaceSerializer
from account.permissions import AccountPermission


class RetreiveAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def get(self, request, pk=None):

        try:
            exists = Space.objects.get(pk=pk)
            self.check_object_permissions(request, exists.user)

            if 'title' not in request.query_params:
                raise ObjectDoesNotExist

            space = Space.objects.retreive(
                pk=pk, title=request.query_params['title'])

            serializer = SpaceSerializer(space)

            return Response({
                'message': 'success',
                'space': serializer.data
            }, status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({
                'errors': 'This space does not exist.'
            }, status.HTTP_404_NOT_FOUND)


class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:
            if len(request.data['title']) > 125 or len(request.data['background']) == 0:
                raise BadRequest(
                    'Background must be selected and title must be under 125 characters.')

            try:
                space = Space.objects.create(request.data, request.user)
                if space is None:
                    raise ValueError('A space with this title already exists.')
                serializer = SpaceSerializer(space)

                return Response({
                    'space': serializer.data
                }, status=status.HTTP_200_OK)
            except (DatabaseError, ValueError, KeyError) as e:
                errors = 'Unable to create a new space.'

                if isinstance(e, ValueError):
                    errors = str(e)
                return Response({
                    'errors': errors
                }, status=status.HTTP_400_BAD_REQUEST)

        except BadRequest as e:
            print(e)
            return Response({
                'errors': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class RetreiveBackgroundAPIView(APIView):

    def get(self, request):
        try:
            url = 'https://api.pexels.com/v1/curated?query=background&per_page=4'
            if 'page' in request.query_params:
                page = request.query_params['page']
                url = f'https://api.pexels.com/v1/curated?page={page}&query=background&per_page=4'

            pexels = Pexels(url)
            result = pexels.fetch_photos()
            if result is not None:
                return Response({
                    'message': 'success',
                    'backgrounds': result['backgrounds'],
                    'page': result['page']
                }, status=status.HTTP_200_OK)
        except (BadRequest, ObjectDoesNotExist, ) as e:
            status_code, error = 400, ''

            return Response({
                'errors': str(e)
            }, status=status_code)
