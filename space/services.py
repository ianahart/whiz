import requests
import logging
from core import settings
logger = logging.getLogger('django')


class Pexels():

    def __init__(self, url: str):
        self.url = url

    def fetch_photos(self):
        headers = {'Authorization': settings.PEXELS_KEY}
        res = requests.get(self.url, headers=headers)
        data = res.json()
        try:
            photos, include = [], ['id', 'src']
            for photo in data['photos']:
                new_dict = {}
                for key in photo.keys():
                    if key in include:
                        new_dict[key] = photo[key]
                photos.append(new_dict)

            for i in range(len(photos)):
                photos[i]['thumbnail'] = photos[i]['src']['tiny']
                photos[i]['src'] = photos[i]['src']['original']

            if data['next_page']:
                page = data['page'] + 1
            else:
                page = 0
                photos = []
            return {'backgrounds': photos, 'page': page}

        except KeyError as e:
            logger.error(
                f'{str(e)} is an invalid key in result from fetching photos from pexels.')
