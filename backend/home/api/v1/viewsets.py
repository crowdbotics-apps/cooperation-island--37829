from django.contrib.auth import get_user_model
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_auth.views import LoginView as RestAuthLoginView
from rest_auth.registration.views import RegisterView as RestAuthRegisterView
from allauth.account.utils import send_email_confirmation
from allauth.account.views import ConfirmEmailView as AllauthConfirmEmailView
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt

from home.utils import encrypt_payload


User = get_user_model()



from home.api.v1.serializers import (
    SignupSerializer,
    UserSerializer,
    UserDetailsSerializer,
    ConsentAccessCodeSerializer,
)


class SignupViewSet(ModelViewSet):
    serializer_class = SignupSerializer
    http_method_names = ["post"]

    def create(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        token, _ = Token.objects.get_or_create(user=user)


        user_detail_serializer = UserDetailsSerializer(user)
        payload=encrypt_payload(user_detail_serializer.data)

        
        response_data = {
            'token': token.key,
            'user': payload
        }
        

        return Response(response_data, status=200)


class LoginViewSet(ViewSet):
    """Based on rest_framework.authtoken.views.ObtainAuthToken"""

    serializer_class = AuthTokenSerializer

    def create(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = UserDetailsSerializer(user)

        payload=encrypt_payload(user_serializer.data)
        return Response({"token": token.key, "user": payload}, status=200)


class ConsentAccessCodeViewSet(APIView):
    """Access code to give consent to the participant"""

    permission_classes= [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = ConsentAccessCodeSerializer(data=request.query_params, context={'request': request})
        serializer.is_valid(raise_exception=True)
        access_code = serializer.validated_data['access_code']
        
        if request.user in access_code.used_by_users.all():
            return Response({'error': 'Access code already used by this user'}, status=401)
        if access_code.is_expired:
            return Response({'error': 'Access code has expired'}, status=401)
        
        access_code.used_by_users.add(request.user)
        access_code.save()
        
        request.user.avatar_id = 0
        request.user.consent_status = True
        request.user.save()

        user_detail_serializer = UserDetailsSerializer(request.user)
        payload=encrypt_payload(user_detail_serializer.data)

        return Response({'user': payload }, status=200)
    
