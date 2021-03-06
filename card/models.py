import logging
from typing import List
from django.db import models
from django.utils import timezone
from datetime import timezone as tz, datetime, timedelta
logger = logging.getLogger('django')


class CardManager(models.Manager):
    def reorder(self, data: List[dict[str, int]]):
        for item in data:
            id, index = item.values()
            card = Card.objects.get(pk=id)
            card.index = index
            card.save()

    def move(self, pk: int, data):
        card = Card.objects.get(pk=pk)
        card.list = data['list']
        card.save()

    def update(self, pk, **kwargs):
        Card.objects.all().order_by(
            '-id'
        ).filter(
            pk=pk
        ).update(**kwargs)

    def delete(self, pk=None):
        card = Card.objects.get(pk=pk)
        card.delete()

    def __make_date_range(self, start: datetime, end: datetime):
        range_start = start.strftime('%m/%d')
        range_end = end.strftime('%m/%d')

        year = end.strftime('%Y')
        return f'{range_start} - {range_end} {year}'

    def retreive_all(self, pk=None):
        cards = Card.objects.all().order_by('index').filter(list_id=pk)
        for card in cards:
            card.date_range = self.__make_date_range(
                card.start_date, card.end_date)
        return cards

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

        card.date_range = self.__make_date_range(
            card.start_date, card.end_date)

        return card

    def __readable_date(self, card):
        now, msg = datetime.now(timezone.utc), ''
        diff = now - card.created_at
        hrs = round(diff.seconds / 3600)
        try:
            msg = str(diff).split(',')[0]
            if 'day' in msg:
                return f'{msg} ago.'
        except IndexError:
            logger.error('Unable to create a readable date for a card.')

        if hrs <= 24:
            msg = '' f'{hrs} hours ago.'
        return msg

    def retreive(self, pk):
        card = Card.objects.get(pk=pk)
        if card is None:
            return None
        card.list_title = card.list.title
        card.details = card.details if card.details is not None else ''

        card.date_range = self.__make_date_range(
            card.start_date, card.end_date)

        checklists = card.card_checklists.all()
        for i in range(len(checklists)):
            checklists[i].items = checklists[i].checklist_checklist_items.all()
        card.checklists = checklists
        card.readable_date = self.__readable_date(card)
        return card


class Card(models.Model):

    objects: CardManager = CardManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    label = models.CharField(max_length=75, blank=True, null=True)
    text = models.CharField(max_length=75, blank=True, null=True)
    color = models.CharField(max_length=32, blank=True, null=True)
    index = models.IntegerField(default=0, blank=True, null=True)
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
