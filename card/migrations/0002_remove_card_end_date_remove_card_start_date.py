# Generated by Django 4.0.4 on 2022-06-01 15:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('card', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='card',
            name='end_date',
        ),
        migrations.RemoveField(
            model_name='card',
            name='start_date',
        ),
    ]
