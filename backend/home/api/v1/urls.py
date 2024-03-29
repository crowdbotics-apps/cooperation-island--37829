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
    ActivityFeedbackViewSet,
    RankedQualitiesAPIView,
    TreeShakingGameTrialView,
    DataGenerateView,
    DynamicPromptAPIView,
    BuyThemeView,
    ThemeDetailsAPIView,
    SendThemeAsPdfView,
    IntermediateVerificationView,
)


router = DefaultRouter()
router.register("signup", SignupViewSet, basename="signup")
router.register("login", LoginViewSet, basename="login")   

urlpatterns = [
    path("", include(router.urls)),
    path('refresh/',UserDetailView.as_view(), name='user-detail'),
    path('access-code/', ConsentAccessCodeViewSet.as_view(), name='consent-access-code'),
    path('users/update_avatar_id/', UpdateAvatarIDView.as_view(), name='update_avatar_id'),
    path('verify-intermediate/<str:uidb64>/<str:token>/', IntermediateVerificationView.as_view(), name='verification-intermediate'),
    path('verify/<str:uidb64>/<str:token>/', UserVerificationView.as_view(), name='user-verification'),
    path('reset-password/', ResetPasswordViewSet.as_view({'post': 'create'}), name='reset-password'),
    path('reset-password/<str:session_id>/', ResetPasswordViewSet.as_view({'get': 'retrieve', 'post': 'update'}), name='reset-password-session'),
    path('details/<int:pk>/', ProfileAPIView.as_view(), name='profile-detail'),
    path('details/', ProfileAPIView.as_view(), name='profile-create'),
    path('email/', EmailConsentView.as_view(), name='email-consent'),
    path('assent/', PrivacyPolicyViewSet.as_view({'get':'list'}), name='privacy-policy'),
    path('consent/', TermAndConditionViewSet.as_view({'get':'list'}), name='term-and-condition'),
    path('score/fish-mind-reading/', FishGameTrialAPIView.as_view(), name='fish-trial-list'),
    path('feedback/<str:activity_type>/', ActivityFeedbackViewSet.as_view(), name='activity-feedback'),
    path('qualities/voice-your-values/', RankedQualitiesAPIView.as_view(), name='qualities'),
    path('score/tree-shaking/', TreeShakingGameTrialView.as_view(), name='fish-trial-list'),
    path('data/<str:activity_name>/', DataGenerateView.as_view(), name='activity-data'),
    path('prompt/<str:activity_name>/', DynamicPromptAPIView.as_view(), name='prompt'),
    path('theme/buy/', BuyThemeView.as_view(), name='theme-purchase'),
    path('theme/details/', ThemeDetailsAPIView.as_view(), name='theme-details'),
    path('print/<int:theme_id>/', SendThemeAsPdfView.as_view(), name='send-theme-email'),
    
]