# Generated by Django 3.0.8 on 2020-11-20 21:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0006_auto_20201120_2101"),
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
    ]
