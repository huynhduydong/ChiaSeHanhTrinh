# Generated by Django 5.0.4 on 2024-05-29 13:35

import datetime
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journeys', '0006_remove_report_active_remove_report_created_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='report',
            name='active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='report',
            name='created_date',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
        migrations.AlterField(
            model_name='report',
            name='reported_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reported_reports', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='report',
            name='reporter',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reports_made', to=settings.AUTH_USER_MODEL),
        ),
    ]
