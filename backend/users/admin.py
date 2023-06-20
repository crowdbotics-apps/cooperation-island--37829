from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils.html import format_html
from .models import (ConsentAccessCode, 
                     Profile, 
                     EmailVerification, 
                     PasswordResetSession, 
                     PrivacyPolicy, 
                     TermAndCondition, 
                     FishGameTrial,
                    )
from .utils import export_trials_csv

from users.forms import UserChangeForm, UserCreationForm

User = get_user_model()


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):

    form = UserChangeForm
    add_form = UserCreationForm
    # fieldsets = (("User", {"fields": ("username",)}),) + auth_admin.UserAdmin.fieldsets
    list_display = ["username", "email", "is_superuser", 'age','is_active', 'consent_status']
    search_fields = ["username"]


class FishGameTrialAdmin(admin.ModelAdmin):
    list_display = ['participant', 'trial_number', 'match', 'trial_response_time', 'created_at']

    actions = [export_trials_csv]

    def changelist_view(self, request, extra_context=None):
        if extra_context is None:
            extra_context = {}
        extra_context['export_csv_url'] = reverse('users:export-trials-csv')
        return super().changelist_view(request, extra_context=extra_context)

admin.site.register(FishGameTrial, FishGameTrialAdmin)

admin.site.register(ConsentAccessCode)

admin.site.register(Profile)

admin.site.register(EmailVerification)

admin.site.register(PasswordResetSession)

admin.site.register(PrivacyPolicy)

admin.site.register(TermAndCondition)