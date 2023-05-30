from django.urls import path, include
from rest_framework.routers import DefaultRouter


from home.api.v1.viewsets import (
    SignupViewSet,
    LoginViewSet,
    ConsentAccessCodeViewSet,
    UpdateAvatarIDView,
    ProfileViewSet,
)




router = DefaultRouter()
router.register("signup", SignupViewSet, basename="signup")
router.register("login", LoginViewSet, basename="login")   
router.register("details", ProfileViewSet, basename="profile")   



urlpatterns = [
    path("", include(router.urls)),
    path('access-code/', ConsentAccessCodeViewSet.as_view(), name='consent-access-code'),
    path('users/update_avatar_id/', UpdateAvatarIDView.as_view(), name='update_avatar_id'),
]