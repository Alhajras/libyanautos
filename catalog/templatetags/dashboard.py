from django.template.defaulttags import register

from catalog.models import FuelTypes, VehicleTypes, Locations, Brands


@register.inclusion_tag("dashboard_overview.html", takes_context=True)
def dashboard_overview(context):
    request = context.get("request")
    context.update(
        {
            "fuel_types": FuelTypes,
            "vehicle_types": VehicleTypes,
            "locations": Locations,
            "brands": Brands,
        }
    )
    return context


@register.inclusion_tag("header_template.html", takes_context=True)
def header_template(context):
    request = context.get("request")
    return context


@register.inclusion_tag("footer_template.html", takes_context=True)
def footer_template(context):
    request = context.get("request")
    return context
