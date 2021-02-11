from django import forms
from django.template.defaulttags import register

from catalog.models import Vehicle


@register.inclusion_tag("templatetags/forms/field.html")
def field(formfield, required=False):
    return {"field": formfield, "required": required}


@register.inclusion_tag("templatetags/forms/select.html")
def select(formfield, required=False):
    return {"field": formfield, "required": required}


SORT = (("Newest", "Newest"), ("Cheapest", "Cheapest"))


class VehicleForm(forms.ModelForm):
    query = forms.CharField()
    sort = forms.ChoiceField(
        choices=SORT,
        label="Sort",
        initial="Newest",
        widget=forms.Select(),
        required=True,
    )

    class Meta:
        model = Vehicle
        fields = [
            "fuel",
            "distance",
            "location",
            "type",
            "brand",
            "price",
            "production_year",
            "type",
            "query",
            "sort",
        ]
