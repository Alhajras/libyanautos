from catalog import models
from django.contrib.auth import admin as user_admin
from django.contrib import admin, auth


class ProfileInline(admin.StackedInline):
    model = models.Profile
    can_delete = False
    verbose_name_plural = "Profile"
    extra = 0


class UserAdmin(user_admin.UserAdmin):
    inlines = (ProfileInline,)


admin.site.unregister(auth.models.User)
admin.site.register(auth.models.User, UserAdmin)

# this is quick fix we will chane it when we add permessions to the users
class FilterUserAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        obj.user = request.user
        obj.save()

    def get_queryset(self, request):
        # For Django < 1.6, override queryset instead of get_queryset
        qs = super(FilterUserAdmin, self).get_queryset(request)
        return qs.filter(created_by=request.user)

    def has_change_permission(self, request, obj=None):
        if not obj:
            # the changelist itself
            return True
        return obj.created_by == request.user


class ImageInline(admin.TabularInline):
    model = models.Image
    extra = 0
    fields = ("image", "image_tag", "is_primary")
    readonly_fields = ("image_tag",)


@admin.register(models.Vehicle)
class VehicleAdmin(FilterUserAdmin):
    list_display = ["pk", "title", "price", "created_at"]
    inlines = [ImageInline]
