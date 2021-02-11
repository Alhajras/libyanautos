"""autos URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from . import views as views_base

from django.urls import include, path
from rest_framework import routers
from catalog import views

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"groups", views.GroupViewSet)
router.register(r"vehicle", views.VehicleViewSet)

urlpatterns = [
    path("", views_base.home, name="home"),
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("catalog/", views.cat, name="home"),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path(
        "vehicle-details/<int:vehicle_id>",
        views_base.vehicle_details,
        name="vehicle details",
    ),
]
