# -*- coding: utf-8 -*-
# Generated by Django 1.11.17 on 2023-03-02 10:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('work_app', '0005_worker_gender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='worker',
            name='gender',
            field=models.CharField(default='муж', max_length=8),
        ),
    ]
