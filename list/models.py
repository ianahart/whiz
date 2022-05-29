from django.db import models
from typing import Optional, Union
from django.utils import timezone
from account.models import CustomUser
from space.models import Space


class ListManager(models.Manager):

    def retreive(self, user_id: int, list_id: int):
        return List.objects.all().order_by('-id').filter(
            user_id=user_id
        ).filter(
            pk=list_id
        )

    def list_count(self, user_id: int, space_id: int) -> int:
        return List.objects.all().order_by('-id').filter(
            user_id=user_id
        ).filter(
            space_id=space_id
        ).count()

    def retreive_by_title(self, title: str, space_id):
        return List.objects.all().filter(
            title=title
        ).filter(
            space_id=space_id
        ).first()

    def create(self, data) -> Union['List', dict[str, str]]:
        if self.list_count(data['user'].id, data['space'].id) > 10:
            return {'error': 'You\'ve reached that maximum number of lists for this space'}

        if self.retreive_by_title(data['title'], data['space'].id) is not None:
            return {'error': 'A list with this title already exists.'}

        list = self.model(title=data['title'],
                          space=data['space'],
                          user=data['user'])
        list.save()
        list.refresh_from_db()

        return list

    def update(self, data, pk: int):
        list = List.objects.get(pk=pk)
        if list is not None:
            list.title = data['title']
            list.save()


class List(models.Model):

    objects: ListManager = ListManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    title = models.CharField(max_length=75, blank=True, null=True)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name="user_lists"
    )
    space = models.ForeignKey(
        'space.Space',
        on_delete=models.CASCADE,
        related_name='list_spaces'
    )
