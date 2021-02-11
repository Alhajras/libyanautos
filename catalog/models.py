import os
from uuid import uuid4

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.db import models
from django.utils.safestring import mark_safe

User = get_user_model()


class FuelTypes(models.TextChoices):
    DEFAULT = "--------"
    PETROL = "Petrol"
    DIESEL = "Diesel"
    ELECTRIC = "Electric"


class VehicleTypes(models.TextChoices):
    DEFAULT = "--------"
    CAR = "Car"
    MOTORBIKE = "Motorbike"
    TRUCK = "Truck"


class Locations(models.TextChoices):
    DEFAULT = "--------"
    BENGHAZI = "Benghazi"


class Brands(models.TextChoices):
    DEFAULT = "--------"
    AUDI = "Audi"
    BMW = "BMW"
    DODGE = "Dodge"
    FIAT = "Fiat"
    FORD = "Ford"
    GMC = "GMC"
    HONDA = "Honda"
    HYUNDAI = "Hyundai"
    INFINITI = "Infiniti"
    JAGUAR = "Jaguar"
    JEEP = "Jeep"
    KIA = "Kia"
    LAND_ROVER = "Land_Rover"
    LEXUS = "Lexus"
    LINCOLN = "Lincoln"
    LOTUS = "Lotus"
    MASERATI = "Maserati"
    MAZDA = "Mazda"
    MERCEDES_BENZ = "Mercedes_Benz"
    MITSUBISHI = "Mitsubishi"
    NISSAN = "Nissan"
    PORSCHE = "Porsche"
    ROLLS_ROYCE = "Rolls_Royce"
    SMART = "Smart"
    SUZUKI = "Suzuki"
    TESLA = "Tesla"
    TOYOTA = "Toyota"
    VOLKSWAGEN = "Volkswagen"
    VOLVO = "Volvo"


class Vehicle(models.Model):
    class Meta:
        ordering = ("created_at",)

    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL, related_name="+"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    fuel = models.CharField(
        max_length=10, choices=FuelTypes.choices, default=FuelTypes.DEFAULT,
    )
    distance = models.PositiveIntegerField(default=0)
    location = models.CharField(
        max_length=10, choices=Locations.choices, default=Locations.DEFAULT,
    )
    type = models.CharField(
        max_length=10, choices=VehicleTypes.choices, default=VehicleTypes.DEFAULT,
    )
    production_year = models.PositiveIntegerField(default=0)
    brand = models.CharField(
        max_length=50, choices=Brands.choices, default=Brands.DEFAULT,
    )
    price = models.PositiveIntegerField(default=0)


class Image(models.Model):
    def path_and_rename(instance, filename):
        upload_to = "catalog/static/images"
        ext = filename.split(".")[-1]
        # get filename
        if instance.pk:
            filename = "{}.{}".format(instance.pk, ext)
        else:
            # set filename as random string
            filename = "{}.{}".format(uuid4().hex, ext)
        # return the whole path to the file
        return os.path.join(upload_to, filename)

    vehicle = models.ForeignKey(
        Vehicle, on_delete=models.CASCADE, related_name="images", null=True
    )
    image = models.ImageField(upload_to=path_and_rename)
    is_primary = models.BooleanField(default=False)

    def image_tag(self):
        url = self.image.url.replace("catalog", "")
        return mark_safe('<img src="%s" width="150" height="150" />' % (url))

    image_tag.short_description = "Image"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    store_name = models.CharField(max_length=50, blank=True)
    address = models.TextField(max_length=500, blank=True)
    phone_number = models.CharField(max_length=30, blank=True)
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
