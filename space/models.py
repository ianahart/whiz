from datetime import datetime, timedelta
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.core.paginator import Paginator
from django.utils import timezone
from account.models import CustomUser


class SpaceManager(models.Manager):

    def retreive_all(self, user: CustomUser, page: int, type: str):
        match type:
            case 'starred':
                objects = Space.objects.order_by(
                    '-id'
                ).filter(
                    is_starred=True
                ).filter(user_id=user.pk)
            case 'recent':
                objects = Space.objects.order_by(
                    '-id').all().filter(
                    user_id=user.pk
                ).filter(
                    updated_at__gte=datetime.now(
                        tz=timezone.utc
                    ) - timedelta(days=1))[0:3]
            case _:
                objects = Space.objects.order_by(
                    '-id').all().filter(user_id=user.pk)

        p = Paginator(objects, 3)

        next_page = int(page) + 1
        cur_page = p.page(next_page)

        spaces = cur_page.object_list

        return {'page': next_page, 'next_page': cur_page.has_next(), 'spaces': spaces}

    def update(self, pk: int, **kwargs):
        space = Space.objects.filter(
            pk=pk
        ).first()

        if space is not None:
            Space.objects.filter(pk=space.pk).update(**kwargs)

    def retreive(self, user: int, pk: int, title: str):
        space = Space.objects.all().filter(
            user_id=user
        ).filter(
            pk=pk
        ).filter(
            title=title
        ).first()

        if space is None:
            return None

        lists = []
        for list in space.list_spaces.all().order_by('index'):
            lists.append(list)

        space.updated_at = timezone.now()
        space.save()
        return {'space': space, 'lists': lists}

    def space_by_title(self, user: int, title: str):
        count = Space.objects.all().filter(
            user_id=user
        ).filter(
            title=title
        ).count()
        return True if count > 0 else False

    def count(self, data: dict[str, str], user):
        return Space.objects.all().filter(user_id=user).count()

    def create(self, data: dict[str, str], user):
        space = self.model()

        if self.space_by_title(user.id, data['title']):
            return None

        if 'https://' in data['background']:
            space.thumbnail = data['thumbnail']
            space.background = data['background']
            space.has_background = True
        else:
            space.color = data['background']
            space.has_background = False

        space.title = data['title']
        space.user = user

        space.save()
        space.refresh_from_db()

        return space

    def search(self, data, user: int):
        try:
            results = Space.objects.order_by(
                '-created_at'
            ).filter(
                user_id=user
            ).filter(
                title__icontains=data['search_term'])
            if len(results) == 0:
                raise ObjectDoesNotExist
            return results
        except ObjectDoesNotExist as e:
            return []


class Space(models.Model):
    objects: SpaceManager = SpaceManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    title = models.CharField(max_length=125)
    color = models.CharField(max_length=125, blank=True, null=True)
    background = models.URLField(blank=True, null=True,)
    thumbnail = models.URLField(blank=True, null=True,)
    has_background = models.BooleanField(default=False)
    is_starred = models.BooleanField(default=False)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='user_spaces'
    )

    def __str__(self):
        return self.title
