# Generated by Django 3.0.8 on 2020-12-03 23:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("catalog", "0016_auto_20201202_2205"),
    ]

    operations = [
        migrations.AlterField(
            model_name="image",
            name="vehicle",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="images",
                to="catalog.Vehicle",
            ),
        ),
        migrations.AlterField(
            model_name="vehicle",
            name="created_by",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="+",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
