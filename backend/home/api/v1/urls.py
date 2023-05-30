from django.urls import path, include
from rest_framework.routers import DefaultRouter


from home.api.v1.viewsets import (
    SignupViewSet,
    LoginViewSet,
    ConsentAccessCodeViewSet,
    UserViewSet,
    UpdateAvatarIDView,
    ProfileViewSet,
)




router = DefaultRouter()
router.register("signup", SignupViewSet, basename="signup")
router.register("login", LoginViewSet, basename="login")   
router.register("details", ProfileViewSet, basename="profile")   

# router.register('users', UserViewSet) 
# print(router.urls)

urlpatterns = [
    path("", include(router.urls)),
    path('access-code/', ConsentAccessCodeViewSet.as_view(), name='consent-access-code'),
    path('users/update_avatar_id/', UpdateAvatarIDView.as_view(), name='update_avatar_id'),
    # path('avatar/<int:pk>/', UserViewSet.as_view({'patch': 'partial_update'}), name='avatar-update'),
]