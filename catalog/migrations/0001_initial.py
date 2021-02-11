# Generated by Django 3.1.3 on 2020-11-14 00:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="vehicle",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("color", models.CharField(max_length=100)),
                ("name", models.CharField(max_length=100)),
                ("description", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("is_open", models.BooleanField(default=True)),
                ("type", models.CharField(max_length=100)),
                ("distance", models.CharField(max_length=100)),
                ("location", models.CharField(max_length=100)),
                ("fuel", models.CharField(max_length=100)),
                ("production_year", models.CharField(max_length=50)),
                ("brand", models.CharField(max_length=100)),
                (
                    "created_by",
                    models.OneToOneField(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={"ordering": ("name",),},
        ),
    ]