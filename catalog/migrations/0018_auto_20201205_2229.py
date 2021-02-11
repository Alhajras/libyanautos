# Generated by Django 3.0.8 on 2020-12-05 22:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0017_auto_20201203_2338"),
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
            model_name="vehicle", name="distance", field=models.PositiveIntegerField(),
        ),
        migrations.AlterField(
            model_name="vehicle",
            name="price",
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name="vehicle",
            name="production_year",
            field=models.PositiveIntegerField(),
        ),
    ]
