# Generated by Django 4.0.4 on 2022-06-22 23:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('card', '0003_card_end_date_card_start_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='card',
            name='index',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]