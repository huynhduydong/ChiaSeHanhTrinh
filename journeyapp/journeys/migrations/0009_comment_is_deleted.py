# Generated by Django 5.0.4 on 2024-06-01 07:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journeys', '0008_activitylog'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='is_deleted',
            field=models.BooleanField(default=False),
        ),
    ]
