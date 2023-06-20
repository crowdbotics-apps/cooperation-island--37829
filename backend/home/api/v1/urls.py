from django.urls import path, include
from rest_framework.routers import DefaultRouter


from home.api.v1.viewsets import (
    SignupViewSet,
    LoginViewSet,
    ConsentAccessCodeViewSet,
    UpdateAvatarIDView,
    UserVerificationView,
    UserDetailView,
    ResetPasswordViewSet,
    ProfileAPIView,
    EmailConsentView,
    PrivacyPolicyViewSet,
    TermAndConditionViewSet,
    FishGameTrialAPIView,
)




router = DefaultRouter()
router.register("signup", SignupViewSet, basename="signup")
router.register("login", LoginViewSet, basename="login")   


urlpatterns = [
    path("", include(router.urls)),
    path('refresh/',UserDetailView.as_view(), name='user-detail'),
    path('access-code/', ConsentAccessCodeViewSet.as_view(), name='consent-access-code'),
    path('users/update_avatar_id/', UpdateAvatarIDView.as_view(), name='update_avatar_id'),
    path('verify/<str:uidb64>/<str:token>/', UserVerificationView.as_view(), name='user-verification'),
    path('reset-password/', ResetPasswordViewSet.as_view({'post': 'create'}), name='reset-password'),
    path('reset-password/<str:session_id>/', ResetPasswordViewSet.as_view({'get': 'retrieve', 'post': 'update'}), name='reset-password-session'),
    path('details/<int:pk>/', ProfileAPIView.as_view(), name='profile-detail'),
    path('details/', ProfileAPIView.as_view(), name='profile-create'),
    path('email/', EmailConsentView.as_view(), name='email-consent'),
    path('privacy/', PrivacyPolicyViewSet.as_view({'get':'list'}), name='privacy-policy'),
    path('terms-conditions/', TermAndConditionViewSet.as_view({'get':'list'}), name='term-and-condition'),
    path('score/fish-mind-reading/', FishGameTrialAPIView.as_view(), name='fish-trial-list'),

]