# Generated by Django 5.0.4 on 2024-06-11 15:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journeys', '0009_comment_is_deleted'),
    ]

    operations = [
        migrations.AddField(
            model_name='journey',
            name='end_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='journey',
            name='is_completed',
            field=models.BooleanField(default=False),
        ),
    ]
