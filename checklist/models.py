from django.db import models
from django.utils import timezone


class CheckListManager(models.Manager):
    def create(self, data):
        checklist = self.model(user=data['user'],
                               card=data['card'],
                               title=data['title'])
        checklist.save()
        checklist.refresh_from_db()

        return checklist


class CheckListItemManager(models.Manager):

    def create(self, data):
        checklist_item = self.model(
            user=data['user'],
            card=data['card'],
            title=data['title'],
            checklist=data['checklist'],
        )

        checklist_item.save()
        checklist_item.refresh_from_db()

        return checklist_item

    def update_complete(self, data: dict[str, bool], pk: int):
        list_item = CheckListItem.objects.get(pk=pk)

        if list_item is not None:
            list_item.is_complete = data['is_complete']
            list_item.save()


class CheckListItem(models.Model):
    objects: CheckListItemManager = CheckListItemManager()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    title = models.CharField(max_length=50)
    is_complete = models.BooleanField(default=False)
    checklist = models.ForeignKey(
        'checklist.Checklist',
        on_delete=models.CASCADE,
        related_name='checklist_checklist_items'
    )
    card = models.ForeignKey(
        'card.Card',
        on_delete=models.CASCADE,
        related_name='card_checklist_items')
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='user_checklist_items')


class Checklist(models.Model):

    objects: CheckListManager = CheckListManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    title = models.CharField(max_length=50)
    is_complete = models.BooleanField(default=False)
    card = models.ForeignKey(
        'card.Card',
        on_delete=models.CASCADE,
        related_name='card_checklists')
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='user_checklists')
