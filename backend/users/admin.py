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
                     RankedQualities,
                     TreeShakingGameTrial,
                     IndividualRankingQualitiesScore,
                    )

from .utils import (
                    export_fishgame_trials_csv, 
                    export_rankedqualities_csv, 
                    export_treeshaking_trials_csv,
                    export_profile_csv,
                    export_scores_csv,
                )

User = get_user_model()


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):

    form = UserChangeForm
    add_form = UserCreationForm
    # fieldsets = (("User", {"fields": ("username",)}),) + auth_admin.UserAdmin.fieldsets
    list_display = ['username', 'email', 'age', 'consent_status', 'date_joined']
    search_fields = ('email','username')
    list_filter = [
        ('consent_status', admin.BooleanFieldListFilter),
        ('date_joined'),

    ]


admin.site.register(ConsentAccessCode)

admin.site.register(EmailVerification)

admin.site.register(PasswordResetSession)

admin.site.register(PrivacyPolicy)

admin.site.register(TermAndCondition)


class FishGameTrialAdmin(admin.ModelAdmin):
    list_display = ['participant','original_participant_id', 'trial_number', 'match', 'trial_response_time', 'created_at']
    list_filter = [
        ('created_at'),
    ]
    actions = ['export_selected_trials_csv']

    def export_selected_trials_csv(self, request, queryset):
        return export_fishgame_trials_csv(request, queryset=queryset, modeladmin=self)

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
        if self.question_type in ['multiple_choice', 'dropdown'] and count < 2:
            raise ValidationError("At least 2 answer options are required.")


AnswerOptionInlineFormSet = forms.inlineformset_factory(
    Question,
    AnswerOption,
    form=AnswerOptionInlineForm,
    formset=BaseAnswerOptionInlineFormSet,
)


class AnswerOptionInline(admin.TabularInline):
    model = AnswerOption
    formset = AnswerOptionInlineFormSet
    extra = 2


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


@admin.register(AnswerOption)
class AnswerOptionAdmin(admin.ModelAdmin):
    list_display = ['option_text', 'question']


@admin.register(QuestionOrder)
class QuestionOrderAdmin(admin.ModelAdmin):
    list_display = ['activity_feedback', 'question', 'order']



class ParticipantResponseAdmin(admin.ModelAdmin):
    list_display = ['participant', 'original_participant_id', 'activity_feedback', 'question', 'original_question_text', 'text_answer']
    list_filter = [
        ('created_at'),
    ]
admin.site.register(ParticipantResponse, ParticipantResponseAdmin)

class RankedQualitiesAdmin(admin.ModelAdmin):
    list_display = ['participant', 'original_participant_id', 'quality', 'category', 'rank']
    actions = ['export_selected_rankedqualities_csv']
    list_filter = [
        ('created_at'),
    ]

    def export_selected_rankedqualities_csv(self, request, queryset):
        return export_rankedqualities_csv(request, queryset=queryset, modeladmin=self)

    export_selected_rankedqualities_csv.short_description = 'Export selected ranked qualities as CSV'

    def changelist_view(self, request, extra_context=None):
        if extra_context is None:
            extra_context = {}

        if self.model == RankedQualities:
            extra_context['export_csv_url'] = reverse('users:export_rankedqualities_csv')

        return super().changelist_view(request, extra_context=extra_context)

admin.site.register(RankedQualities, RankedQualitiesAdmin)


class IndividualRankingQualitiesScoreAdmin(admin.ModelAdmin):
    list_display = ['participant', 'original_participant_id','question', 'original_question_text', 'score', 'created_at']
    actions = ['export_selected_scores_csv']
    list_filter = [
        ('created_at'),
    ]

    def export_selected_scores_csv(self, request, queryset):
        return export_scores_csv(request, queryset=queryset, modeladmin=self)

    export_selected_scores_csv.short_description = 'Export selected scores as CSV'

    def changelist_view(self, request, extra_context=None):
        if extra_context is None:
            extra_context = {}

        if self.model == IndividualRankingQualitiesScore:
            extra_context['export_csv_url'] = reverse('users:export_scores_csv')

        return super().changelist_view(request, extra_context=extra_context)

admin.site.register(IndividualRankingQualitiesScore, IndividualRankingQualitiesScoreAdmin)


class TreeShakingGameTrialAdmin(admin.ModelAdmin):
    list_display = ['participant', 'original_participant_id', 'trial_number', 'shell', 'shared_shell', 'response', 'trial_response_time', 'created_at']
    actions = ['export_selected_trials_csv']
    list_filter = [
        ('created_at'),
    ]

    def export_selected_trials_csv(self, request, queryset):
        return export_treeshaking_trials_csv(request, queryset=queryset, modeladmin=self)

    export_selected_trials_csv.short_description = 'Export selected trials as CSV'

    def changelist_view(self, request, extra_context=None):
        if extra_context is None:
            extra_context = {}

        if self.model == TreeShakingGameTrial:
            extra_context['export_csv_url'] = reverse('users:export-treeshaking-trial-csv')

        return super().changelist_view(request, extra_context=extra_context)

admin.site.register(TreeShakingGameTrial, TreeShakingGameTrialAdmin)


class ProfileAdmin(admin.ModelAdmin):
    list_display = ['participant', 'birth_month', 'birth_year', 'nationality', 'gender', 'zipcode']
    actions = ['export_selected_profiles_csv']
    list_filter = [
        ('created_at'),
    ]

    def export_selected_profiles_csv(self, request, queryset):
        return export_profile_csv(request, queryset=queryset, modeladmin=self)

    export_selected_profiles_csv.short_description = 'Export selected profiles as CSV'

    def changelist_view(self, request, extra_context=None):
        if extra_context is None:
            extra_context = {}

        if self.model == Profile:
            extra_context['export_csv_url'] = reverse('users:export_profiles_csv')

        return super().changelist_view(request, extra_context=extra_context)

admin.site.register(Profile, ProfileAdmin)
