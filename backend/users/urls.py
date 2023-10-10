from django.urls import path

from users.views import (
    user_redirect_view,
    user_update_view,
    user_detail_view,
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

app_name = "users"
urlpatterns = [
    path('export-fishgame-trials-csv/', export_fishgame_trials_csv, name='export-fish-trial-csv'),
    path('export-treeshaking-trials-csv/', export_treeshaking_trials_csv, name='export-treeshaking-trial-csv'),
    path('export-rankedqualities-csv/', export_rankedqualities_csv, name='export_rankedqualities_csv'),
    path('export-scores-csv/', export_scores_csv, name='export_scores_csv'),
    path('export-profiles-csv/', export_profile_csv, name='export_profiles_csv'),
    path('export-purchase-history-csv/', export_purchase_history_csv, name='export-purchase-history-csv'),
    path('export-dynamic-prompt-responses-csv/', export_dynamic_prompt_responses_csv, name='export-dynamic-prompt-responses-csv'),
    path('export-participant-responses-csv/', export_participant_responses_csv, name='export-participant-responses-csv'),
    # path("~redirect/", view=user_redirect_view, name="redirect"),
    # path("~update/", view=user_update_view, name="update"),
    # path("<str:username>/", view=user_detail_view, name="detail"),
]
