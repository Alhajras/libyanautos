# Generated by Django 3.1.3 on 2020-11-14 23:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(model_name="vehicle", name="is_open",),
    ]
