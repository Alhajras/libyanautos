# Generated by Django 3.0.8 on 2020-12-09 19:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0019_auto_20201209_1948"),
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
            name="distance",
            field=models.PositiveIntegerField(default=0),
        ),
    ]
