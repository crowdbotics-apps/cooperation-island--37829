from django.contrib import admin
from django.contrib import messages
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model
from django.urls import reverse
from django import forms
from django.core.exceptions import ValidationError
from django.forms import BaseInlineFormSet
from users.forms import UserChangeForm, UserCreationForm
from .models import (ConsentAccessCode, 
                     Profile, 
                     EmailVerification, 
                     PasswordResetSession, 
                     PrivacyPolicy, 
                     TermAndCondition, 
                     FishGameTrial,
                     ActivityFeedback,
                     Question,
                     AnswerOption,
                     QuestionOrder,
                     ParticipantResponse,
                    )

from .utils import export_trials_csv

User = get_user_model()


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):

    form = UserChangeForm
    add_form = UserCreationForm
    # fieldsets = (("User", {"fields": ("username",)}),) + auth_admin.UserAdmin.fieldsets
    list_display = ["username", "email", "is_superuser", 'age','is_active', 'consent_status']
    search_fields = ["username"]
    list_filter = [
        ('consent_status', admin.BooleanFieldListFilter),
        ('date_joined'),

    ]


admin.site.register(ConsentAccessCode)

admin.site.register(Profile)

admin.site.register(EmailVerification)

admin.site.register(PasswordResetSession)

admin.site.register(PrivacyPolicy)

admin.site.register(TermAndCondition)


class FishGameTrialAdmin(admin.ModelAdmin):
    list_display = ['participant', 'trial_number', 'match', 'trial_response_time', 'created_at']

    actions = ['export_selected_trials_csv']

    def export_selected_trials_csv(self, request, queryset):
        return export_trials_csv(request, queryset=queryset, modeladmin=self)

    export_selected_trials_csv.short_description = 'Export selected trials as CSV'

    def changelist_view(self, request, extra_context=None):
        if extra_context is None:
            extra_context = {}

        if self.model == FishGameTrial:
            extra_context['export_csv_url'] = reverse('users:export-fish-trial-csv')

        return super().changelist_view(request, extra_context=extra_context)

admin.site.register(FishGameTrial, FishGameTrialAdmin)


class AnswerOptionInlineForm(forms.ModelForm):
    class Meta:
        model = AnswerOption
        fields = ['option_text']

class BaseAnswerOptionInlineFormSet(BaseInlineFormSet):
    def __init__(self, *args, **kwargs):
        question_type = kwargs.pop('question_type', None)
        super().__init__(*args, **kwargs)
        self.question_type = question_type

    def clean(self):
        super().clean()
        count = 0
        for form in self.forms:
            if form.cleaned_data and not form.cleaned_data.get('DELETE', False):
                count += 1
        print(self.question_type)
        if self.question_type in ['multiple_choice', 'dropdown'] and count < 4:
            raise ValidationError("At least 4 answer options are required.")


AnswerOptionInlineFormSet = forms.inlineformset_factory(
    Question,
    AnswerOption,
    form=AnswerOptionInlineForm,
    formset=BaseAnswerOptionInlineFormSet,
    extra=4,
    min_num=4,
    max_num=4,
    validate_min=True,
    validate_max=True
)


class AnswerOptionInline(admin.TabularInline):
    model = AnswerOption
    formset = AnswerOptionInlineFormSet
    extra = 4


class QuestionInline(admin.StackedInline):
    model = Question
    extra = 1
    inlines = [AnswerOptionInline]


class QuestionOrderInline(admin.TabularInline):
    model = QuestionOrder
    extra = 1
    inlines = [QuestionInline]


@admin.register(ActivityFeedback)
class ActivityFeedbackAdmin(admin.ModelAdmin):
    inlines = [QuestionOrderInline]
    list_display = ['activity_type']


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['question_text', 'question_type']
    inlines = [AnswerOptionInline]

    def change_view(self, request, object_id, form_url='', extra_context=None):
        question = self.get_object(request, object_id)
        if question.question_type in ['dropdown', 'multiple_choice']:
            self.message_user(request, "Please provide four answer options.", messages.INFO)
        if question.question_type =='text_input':
            self.message_user(request, "Please leave answer options empty.", messages.INFO)

        return super().change_view(request, object_id, form_url, extra_context=extra_context)


@admin.register(AnswerOption)
class AnswerOptionAdmin(admin.ModelAdmin):
    list_display = ['option_text', 'question']


@admin.register(QuestionOrder)
class QuestionOrderAdmin(admin.ModelAdmin):
    list_display = ['activity_feedback', 'question', 'order']


admin.site.register(ParticipantResponse)