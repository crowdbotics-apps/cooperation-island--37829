from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model
from .models import ConsentAccessCode, Profile


from users.forms import UserChangeForm, UserCreationForm

User = get_user_model()


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):

    form = UserChangeForm
    add_form = UserCreationForm
    # fieldsets = (("User", {"fields": ("username",)}),) + auth_admin.UserAdmin.fieldsets
    list_display = ["username", "email", "is_superuser", 'age','is_active', 'consent_status']
    search_fields = ["username"]



admin.site.register(ConsentAccessCode)

admin.site.register(Profile)