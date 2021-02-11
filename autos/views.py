from django.core.paginator import Paginator
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render

from autos.forms import VehicleForm
from catalog import models
from django.shortcuts import render
from .settings import EMAIL_HOST_USER
from . import forms
from django.core.mail import send_mail


def home(request: HttpRequest) -> HttpResponse:
    # subject = 'Welcome to DataFlair'
    # message = 'Hope you are enjoying your Django Tutorials'
    # send_mail(subject, message, EMAIL_HOST_USER, ["alhajras.algdairy@gmail.com"], fail_silently=False)

    kwargs = {}
    # use request.GET.get instead
    try:
        query = request.GET["query"]
        if query != "":
            kwargs["name__contains"] = query

        price = request.GET["price"]
        if int(price) != 0:
            kwargs["price"] = price

        location = request.GET["location"]
        if location != "--------":
            kwargs["location"] = location

        distance = request.GET["distance"]
        if int(distance) != 0:
            kwargs["distance"] = distance

        fuel = request.GET["fuel"]
        if fuel != "--------":
            kwargs["fuel"] = fuel

        type = request.GET["type"]
        if type != "--------":
            kwargs["type"] = type

        brand = request.GET["brand"]
        if brand != "--------":
            kwargs["brand"] = brand

        production_year = request.GET["production_year"]
        if int(production_year) != 0:
            kwargs["production_year"] = production_year

    except Exception as err:
        print(err)
    vehicles_dict = {}

    sort = request.GET.get("sort")
    if sort == "Cheapest":
        cars = (
            models.Vehicle.objects.all()
            .filter(**kwargs)
            .order_by("price", "created_at")
        )
    else:
        cars = models.Vehicle.objects.all().filter(**kwargs)

    kwargs["sort"] = sort
    form = VehicleForm(initial=kwargs)

    paginator = Paginator(cars, 21)  # Show 21 contacts per page.

    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    for car in page_obj:
        profile = models.Profile.objects.get(user=car.created_by)
        images = models.Image.objects.all().filter(vehicle=car)
        if len(images) != 0:
            vehicles_dict[car] = {"default_image": images[0].image.url.replace("catalog/static", ""), "profile": profile}
        else:
            vehicles_dict[car] = {"default_image": "images/default.jpg", "profile": profile}

    context = {"cars_list": vehicles_dict, "form": form, "page_obj": page_obj}
    return render(request, "cars_list.html", context)


def vehicle_details(request: HttpRequest, vehicle_id: int) -> HttpResponse:
    vehicle = models.Vehicle.objects.get(pk=vehicle_id)
    images = models.Image.objects.all().filter(vehicle=vehicle)
    images_url = [image.image.url.replace("catalog/static", "") for image in images]
    primary_image = "images/default.jpg"
    if len(images_url) != 0:
        primary_image = images_url[0]
    for image in images:
        if image.is_primary:
            primary_image = image.image.url.replace("catalog/static", "")
    profile = models.Profile.objects.get(user=vehicle.created_by)
    social_media_links = {
        "facebook": profile.facebook_url,
        "twitter": profile.twitter_url,
        "instagram": profile.instagram_url,
    }
    context = {
        "vehicle": vehicle,
        "images": images_url,
        "primary_image": primary_image,
        "profile": profile,
        "social_media_links": social_media_links,
    }
    return render(request, "vehicle_details.html", context)
