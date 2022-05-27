from django.core.exceptions import BadRequest, ObjectDoesNotExist
from django.db import DatabaseError
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from space.models import Space
from .services import Pexels


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
