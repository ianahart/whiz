# Generated by Django 4.0.4 on 2022-05-24 23:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0008_alter_customuser_avatar_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='avatar_url',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
    ]
