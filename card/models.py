from django.db import models
from django.utils import timezone
from datetime import timezone as tz, datetime, timedelta


class CardManager(models.Manager):

    def update(self, pk, **kwargs):
        Card.objects.all().order_by(
            '-id'
        ).filter(
            pk=pk
        ).update(**kwargs)

    def delete(self, pk=None):
        card = Card.objects.get(pk=pk)
        card.delete()

    def retreive_all(self, pk=None):
        return Card.objects.all().filter(list_id=pk)

    def create(self, data):
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

    def retreive(self, pk):
        card = Card.objects.get(pk=pk)
        if card is None:
            return None
        card.list_title = card.list.title
        card.details = card.details if card.details is not None else ''

        now = datetime.now(timezone.utc)
        diff = now - card.created_at
        hrs = round(diff.seconds / 3600)

        msg = 'day'

        if hrs < 24:
            msg = '' f'{hrs} hours ago.'

        card.readable_date = msg

        return card


class Card(models.Model):

    objects: CardManager = CardManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    label = models.CharField(max_length=75, blank=True, null=True)
    text = models.CharField(max_length=75, blank=True, null=True)
    color = models.CharField(max_length=32, blank=True, null=True)
    details = models.TextField(max_length=500, blank=True, null=True)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(default=timezone.now)

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
