from django.urls import path, include
from rest_framework.routers import DefaultRouter


from home.api.v1.viewsets import (
    SignupViewSet,
    LoginViewSet,
    ConsentAccessCodeViewSet,
    # UserViewSet
)




router = DefaultRouter()
router.register("signup", SignupViewSet, basename="signup")
router.register("login", LoginViewSet, basename="login")    

urlpatterns = [
    path("", include(router.urls)),
    path('access-code/', ConsentAccessCodeViewSet.as_view(), name='consent-access-code'),
    # path('avatar/<int:avatar_id>/', UserViewSet.as_view(), name='avatar-update'),
]