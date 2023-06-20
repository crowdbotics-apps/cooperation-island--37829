from django.urls import path
from .models import FishGameTrial

from users.views import (
    user_redirect_view,
    user_update_view,
    user_detail_view,
)
from .utils import export_trials_csv

app_name = "users"
urlpatterns = [
    path('export-trials-csv/', export_trials_csv, {'queryset': FishGameTrial.objects.all()}, name='export-trials-csv'),
    # path("~redirect/", view=user_redirect_view, name="redirect"),
    # path("~update/", view=user_update_view, name="update"),
    # path("<str:username>/", view=user_detail_view, name="detail"),
]
