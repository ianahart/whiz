from django.core.exceptions import BadRequest, ObjectDoesNotExist
from django.db import DatabaseError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from list.serializers import ListSerializer
from space.models import Space
from .services import Pexels
from space.serializers import SearchSpaceSerializer, UpdateSpaceSerializer, CreateSpaceSerializer, SpaceSerializer
from account.permissions import AccountPermission


class SearchAPIView(APIView):
    def post(self, request):
        try:
            serializer = SearchSpaceSerializer(
                data=request.data)

            if serializer.is_valid():
                spaces = Space.objects.search(
                    serializer.validated_data, request.user.id)

                if spaces is not None and len(spaces) == 0:
                    raise ObjectDoesNotExist('No results.')
                space_serializer = SpaceSerializer(spaces, many=True)
                return Response({
                    'message': 'success',
                    'results': space_serializer.data
                }, status=status.HTTP_200_OK)

            else:
                return Response({
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

        except (ObjectDoesNotExist, ) as e:
            return Response({
                'errors': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class DetailAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def delete(self, request, pk=None):
        try:
            space = Space.objects.get(pk=pk)
            self.check_object_permissions(request, space.user)

            space.delete()

            return Response({
                            }, status=status.HTTP_204_NO_CONTENT)
        except (Exception, BadRequest, ):
            return Response({
                            'message': 'something went wrong.'
                            }, status=status.HTTP_400_BAD_REQUEST)


    def patch(self, request, pk=None):
        try:
            exists = Space.objects.get(pk=pk)
            self.check_object_permissions(request, exists.user)

            serializer = UpdateSpaceSerializer(data=request.data)
            if serializer.is_valid():
                Space.objects.update(pk=pk, **serializer.data)
                return Response({
                                'message': 'success'
                                })
            else:
                raise BadRequest
        except (Exception, BadRequest, ):
            return Response({
                            'message': 'something went wrong.'
                            }, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk=None):

        try:
            exists = Space.objects.get(pk=pk)
            self.check_object_permissions(request, exists.user)

            if 'title' not in request.query_params:
                raise ObjectDoesNotExist

            space = Space.objects.retreive(
                user=request.user.id,
                pk=pk, title=request.query_params['title'])
            if space is None:
                raise ObjectDoesNotExist
            space_serializer = SpaceSerializer(space['space'])
            list_serializer = ListSerializer(space['lists'], many=True)
            return Response({
                'message': 'success',
                'space': space_serializer.data,
                'lists': list_serializer.data
            }, status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({
                'errors': 'This space does not exist.'
            }, status.HTTP_404_NOT_FOUND)


class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:

            if 'page' not in request.query_params:
                raise ObjectDoesNotExist('Malformed url')

            spaces = Space.objects.retreive_all(
                request.user, request.query_params['page'],
                request.query_params['type'])

            serializer = SpaceSerializer(spaces['spaces'], many=True)

            return Response({
                'message': 'success',
                'spaces': serializer.data,
                'has_next': spaces['next_page'],
                'page': spaces['page']
            }, status=status.HTTP_200_OK)

        except ObjectDoesNotExist as e:
            return Response({
                            'errors': str(e)
                            }, status.HTTP_404_NOT_FOUND)

    def post(self, request):
        try:
            if len(request.data['title']) > 125 or len(request.data['background']) == 0:
                raise BadRequest(
                    'Background must be selected and title must be under 125 characters.')

            try:
                num_of_spaces = Space.objects.count(request.data, request.user)

                print(num_of_spaces)
                if num_of_spaces >= 10:
                    raise ValueError('You can have a maximum of 10 spaces.')

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
