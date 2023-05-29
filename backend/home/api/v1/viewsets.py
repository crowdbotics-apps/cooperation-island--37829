from django.contrib.auth import get_user_model
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
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
from users.models import Profile

User = get_user_model()



from home.api.v1.serializers import (
    SignupSerializer,
    UserSerializer,
    UserDetailsSerializer,
    ConsentAccessCodeSerializer,
    UserProfileSerializer,
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
    


class UpdateAvatarIDView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        avatar_id = request.data.get('avatar_id')

        if avatar_id:
            user.avatar_id = avatar_id
            user.save()
            user_detail_serializer = UserDetailsSerializer(user)
            payload=encrypt_payload(user_detail_serializer.data)
            return Response({'user': payload }, status=200)
        else:
            return Response({'message': 'No avatar ID provided.'}, status=400)




class ProfileViewSet(ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Profile.objects.filter(participant=self.request.user)
    

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        user_detail_serializer = UserDetailsSerializer(request.user)
        payload=encrypt_payload(user_detail_serializer.data)

        
        response_data = {
            'user': payload
        }
        

        return Response(response_data, status=200)

    def perform_create(self, serializer):
        user = self.request.user
        profile, created = Profile.objects.get_or_create(participant=user)
        
        if not created:
            serializer.instance = profile
            serializer.is_valid(raise_exception=True)
            serializer.save()
        else:
            serializer.save(participant=user)

    def perform_update(self, serializer):
        serializer.save(participant=self.request.user)










class UserViewSet(ModelViewSet):
    """Update the avatar_id"""
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['patch'])
    def update_avatar_id(self, request):
        user = request.user
        avatar_id = request.data.get('avatar_id')
        consent_status = request.user.consent_status
        if avatar_id:
            if consent_status:
                user.avatar_id = avatar_id
                user.save()
                return Response({'message': 'Avatar ID updated successfully.'})
            return Response({'message': 'User doesnt have consent to update'}, status=400)
        else:
            return Response({'message': 'No avatar provided.'}, status=400)

    # def get_queryset(self):
    #     user = User.objects.get(id = self.request.user.pk)
    #     return user

    # def partial_update(self, request, *args, **kwargs):
        
    #     user = self.get_queryset()
    #     print(user)
        # serializer = self.get_serializer(user, data=request.data, partial=True)
        # if serializer.is_valid():
        #     serializer.save()
        #     return Response(serializer.data, status=200)
        
        # return Response(serializer.errors, status=400)
    # def get_object(self):
    #     user = User.objects.get(id=self.request.user.pk)
    #     return user
    
    # @csrf_exempt
    # def patch(self, request, *args, **kwargs):
    #     partial = kwargs.pop('partial', False)
    #     # user = User.objects.get(id=request.user.id)
    #     instance = self.get_object()
    #     print(instance)
    #     avatar_id = request.data.get('avatar_id')
    #     print(avatar_id)
    #     instance.avatar_id = avatar_id
    #     serializer = self.get_serializer(instance, data=request.data, partial=partial)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_update(serializer)

    #     return Response(serializer.data, status=200)

    # def patch(self, request):
    #     user = request.user  
    #     data = {'avatar_id': request.data.get('avatar_id')}
    #     serializer = UserSerializer(user, data=request.data, partial=True)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, statu=200)
        
    #     return Response(serializer.errors, status=400)