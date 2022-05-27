from django.db import models
from django.utils import timezone

# Create your models here.


class SpaceManager(models.Manager):
    pass



class Space(models.Model):
    objects: SpaceManager = SpaceManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    title = models.CharField(max_length=125)
    color = models.CharField(max_length=125, blank=True, null=True)
    background = models.URLField(blank=True, null=True)
    has_background = models.BooleanField(default=False)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='user_spaces'
    )

    def __str__(self):
        return self.title



