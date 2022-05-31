from django.db import models
from django.utils import timezone


class CardManager(models.Manager):
    def create(self, data):
        print(data)
        card = self.model(
            text=data['text'],
            color=data['color'],
            label=data['label'],
            user=data['user'],
            space=data['space'],
            list=data['list'],
        )
        card.save()
        card.refresh_from_db()

        return card


class Card(models.Model):

    objects: CardManager = CardManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    label = models.CharField(max_length=75, blank=True, null=True)
    text = models.CharField(max_length=75, blank=True, null=True)
    color = models.CharField(max_length=32, blank=True, null=True)

    list = models.ForeignKey(
        'list.List',
        on_delete=models.CASCADE,
        related_name="list_cards"
    )
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name="user_cards"
    )
    space = models.ForeignKey(
        'space.Space',
        on_delete=models.CASCADE,
        related_name='space_cards',
    )
