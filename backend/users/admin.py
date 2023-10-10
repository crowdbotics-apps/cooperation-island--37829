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
                     IncentiveRangeSelection, 
                     TreeShakingDistribution,
                     TreeShakingDistributionTrials, 
                     FishGameDistribution,
                     DynamicPrompt,
                     DynamicPromptResponse,
                     ThemeImage,
                     PurchaseHistory,
                     ConsentEmailConfiguration,
                     EmailVerification,
                     ThemeEmailConfiguration,
                    )

from .utils import (
                    export_fishgame_trials_csv, 
                    export_rankedqualities_csv, 
                    export_treeshaking_trials_csv,
                    export_profile_csv,
                    export_scores_csv,
                    export_purchase_history_csv,
                    export_dynamic_prompt_responses_csv,
                    export_participant_responses_csv,
                )

User = get_user_model()


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):

    form = UserChangeForm
    add_form = UserCreationForm
    # fieldsets = (("User", {"fields": ("username",)}),) + auth_admin.UserAdmin.fieldsets
    list_display = ['username','id', 'email', 'age', 'avatar_id', 'consent_status', 'detail_status', 'shells', 'date_joined']
    search_fields = ('email','username')
    list_filter = [
        ('consent_status', admin.BooleanFieldListFilter),
        ('date_joined'),

    ]

@admin.register(ConsentAccessCode)
class ConsentAccessCodeAdmin(admin.ModelAdmin):
    list_display=['access_code', 'created_at', 'is_expired']
    list_filter=['is_expired', 'created_at']

admin.site.register(ConsentEmailConfiguration)
# admin.site.register(EmailVerification)


@admin.register(PrivacyPolicy)
class PrivacyPolicyAdmin(admin.ModelAdmin):
    list_display=['body', 'author','is_active', 'created_at']
    list_filter = ['is_active','created_at']

@admin.register(TermAndCondition)
class TermAndConditionAdmin(admin.ModelAdmin):
    list_display=['body', 'author','is_active', 'created_at']
    list_filter = ['is_active','created_at']


@admin.register(FishGameTrial)
class FishGameTrialAdmin(admin.ModelAdmin):
    list_display = ['participant','session_id','stakes_type', 'trial_number', 'match', 'trial_response_time', 'shell', 'number', 'participant_shell','created_at']
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
    list_display = ['activity_type', 'created_at']

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['activity_feedback','question_text', 'question_type','created_at']
    list_filter = ['activity_feedback', 'question_type']
    search_fields = ['question_text']
    inlines = [AnswerOptionInline]


# @admin.register(AnswerOption)
# class AnswerOptionAdmin(admin.ModelAdmin):
#     list_display = ['option_text', 'question']


@admin.register(QuestionOrder)
class QuestionOrderAdmin(admin.ModelAdmin):
    list_display = [ 'question', 'order','activity_feedback', 'created_at']
    list_filter = ['activity_feedback', 'created_at']


class ParticipantResponseAdmin(admin.ModelAdmin):
    list_display = ['participant', 'session_id', 'activity_feedback', 'question', 'text_answer', 'created_at']
    list_filter = ['created_at']
    actions = ['export_selected_responses_csv']

    def export_selected_responses_csv(self, request, queryset):
        return export_participant_responses_csv(request, queryset=queryset, modeladmin=self)

    export_selected_responses_csv.short_description = 'Export selected responses as CSV'

    def changelist_view(self, request, extra_context=None):
        if extra_context is None:
            extra_context = {}

        if self.model == ParticipantResponse:
            extra_context['export_csv_url'] = reverse('users:export-participant-responses-csv')

        return super().changelist_view(request, extra_context=extra_context)

admin.site.register(ParticipantResponse, ParticipantResponseAdmin)

@admin.register(RankedQualities)
class RankedQualitiesAdmin(admin.ModelAdmin):
    list_display = ['participant', 'session_id','quality', 'category', 'rank', 'created_at']
    actions = ['export_selected_rankedqualities_csv']
    list_filter = [
        ('created_at'),
    ]

    def export_selected_rankedqualities_csv(self, request, queryset):
        return export_rankedqualities_csv(request, queryset=queryset, modeladmin=self)

    export_selected_rankedqualities_csv.short_description = 'Export selected Voice Your Values as CSV'

    def changelist_view(self, request, extra_context=None):
        if extra_context is None:
            extra_context = {}

        if self.model == RankedQualities:
            extra_context['export_csv_url'] = reverse('users:export_rankedqualities_csv')

        return super().changelist_view(request, extra_context=extra_context)


@admin.register(IndividualRankingQualitiesScore)
class IndividualRankingQualitiesScoreAdmin(admin.ModelAdmin):
    list_display = ['participant','session_id', 'question', 'score','created_at']
    actions = ['export_selected_scores_csv']
    list_filter = [
        ('created_at'),
    ]

    def export_selected_scores_csv(self, request, queryset):
        return export_scores_csv(request, queryset=queryset, modeladmin=self)

    export_selected_scores_csv.short_description = 'Export selected Voice Your Values Ratings as CSV'

    def changelist_view(self, request, extra_context=None):
        if extra_context is None:
            extra_context = {}

        if self.model == IndividualRankingQualitiesScore:
            extra_context['export_csv_url'] = reverse('users:export_scores_csv')

        return super().changelist_view(request, extra_context=extra_context)


@admin.register(TreeShakingGameTrial)
class TreeShakingGameTrialAdmin(admin.ModelAdmin):
    list_display = ['participant','session_id','stakes_type','participant_shell', 'trial_number', 'shell', 'shared_shell', 'response', 'trial_response_time', 'created_at' ]
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


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['participant', 'birth_month', 'birth_year', 'nationality', 'gender', 'zipcode', 'created_at']
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


class TreeShakingDistributionTrialsInline(admin.TabularInline):
    model = TreeShakingDistributionTrials
    extra = 24


@admin.register(TreeShakingDistribution)
class TreeShakingDistributionAdmin(admin.ModelAdmin):
    list_display = ['stake_level']
    inlines = [TreeShakingDistributionTrialsInline]
    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(FishGameDistribution)
class FishGameDistributionAdmin(admin.ModelAdmin):
    list_display=['stake_level', 'min', 'max', 'author', 'created_at']

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(IncentiveRangeSelection)
class IncentiveRangeSelectionAdmin(admin.ModelAdmin):
    list_display=['stake_level_selected', 'author', 'is_active','created_at']
    list_filter =['is_active', 'created_at']

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(DynamicPrompt)
class DynamicPromptAdmin(admin.ModelAdmin):
    list_display = ['prompt_text', 'activity', 'is_active', 'created_at']
    list_filter = [
        ('activity'),
        ('is_active'),
    ]


@admin.register(DynamicPromptResponse)
class DynamicPromptResponseAdmin(admin.ModelAdmin):
    list_display = ['participant', 'session_id', 'activity', 'dynamic_prompt', 'created_at']
    search_fields= ['dynamic_prompt']
    actions = ['export_dynamic_prompt_responses_csv']

    def export_dynamic_prompt_responses_csv(self, request, queryset):
        return export_dynamic_prompt_responses_csv(request, queryset=queryset, modeladmin=self)

    export_dynamic_prompt_responses_csv.short_description = 'Export Dynamic Prompt Responses as CSV'

    def changelist_view(self, request, extra_context=None):
        if extra_context is None:
            extra_context = {}

        if self.model == DynamicPromptResponse:
            extra_context['export_csv_url'] = reverse('users:export-dynamic-prompt-responses-csv')

        return super().changelist_view(request, extra_context=extra_context)



@admin.register(ThemeImage)
class ThemeImageAdmin(admin.ModelAdmin):
    list_display=['title','price','description']
    readonly_fields = ['name']

    def has_delete_permission(self, request, obj=None):
        return False
    
    def get_exclude(self, request, obj=None):
        if obj is None:
            return ['name']
        return []


@admin.register(PurchaseHistory)
class PurchaseHistoryAdmin(admin.ModelAdmin):
    list_display=['participant','session_id','theme_purchased','purchase_cost','participant_shell_at_purchase','purchased_at']
    list_filter=['theme_purchased','purchased_at']
    actions = ['export_selected_purchase_history_csv']

    def export_selected_purchase_history_csv(self, request, queryset):
        return export_purchase_history_csv(request, queryset=queryset, modeladmin=self)

    export_selected_purchase_history_csv.short_description = 'Export selected purchase history as CSV'

    def changelist_view(self, request, extra_context=None):
        if extra_context is None:
            extra_context = {}

        if self.model == PurchaseHistory:
            extra_context['export_csv_url'] = reverse('users:export-purchase-history-csv')

        return super().changelist_view(request, extra_context=extra_context)


admin.site.register(ThemeEmailConfiguration)