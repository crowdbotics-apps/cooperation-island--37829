from datetime import date
from django.conf import settings
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.http import HttpRequest
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from allauth.account import app_settings as allauth_settings
from allauth.account.forms import ResetPasswordForm
from allauth.utils import email_address_exists, generate_unique_username
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from allauth.account.models import EmailConfirmation, EmailConfirmationHMAC
from rest_auth.serializers import LoginSerializer as RestAuthLoginSerializer
from rest_auth.serializers import PasswordResetConfirmSerializer as RestAuthPasswordResetConfirmSerializer
from rest_auth.registration.serializers import VerifyEmailSerializer as RestAuthVerifyEmailSerializer
from rest_auth.serializers import PasswordResetSerializer as RestAuthPasswordResetSerializer
from users.models import ConsentAccessCode, Profile

User = get_user_model()



class SignupSerializer(serializers.ModelSerializer):
    age=serializers.IntegerField(required=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password','age')
        extra_kwargs = {
            'password': {
                'write_only': True,
                'style': {
                    'input_type': 'password'
                }
            },
            'email': {
                'required': True,
                'allow_blank': False,
            },
            'username': {
                'required': True,
                'allow_blank': False,
            }
        }

    def _get_request(self):
        request = self.context.get('request')
        if request and not isinstance(request, HttpRequest) and hasattr(request, '_request'):
            request = request._request
        return request

    
    def validate_username(self, username):
        username = get_adapter().clean_username(username)
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError("This username is already taken.")
        return username

    def create(self, validated_data):
        user = User(
            email=validated_data.get('email'),
            username=validated_data.get('username'),
            age=validated_data.get('age'),
        )
        user.set_password(validated_data.get('password'))
        user.save()

        # request = self._get_request()
        # setup_user_email(request, user, [])
        return user

    def save(self, request=None):
        """rest_auth passes request so we must override to accept it"""
        return super().save()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username','email' ,'age','password', 'avatar_id', 'consent_status']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','age', 'avatar_id', 'consent_status', 'detail_status']


class UserProfileSerializer(serializers.ModelSerializer):
    GENDER_CHOICES = [
        (0, 'Male'),
        (1, 'Female'),
    ]

    class Meta:
        model = Profile
        fields = ['birth_month', 'birth_year', 'nationality', 'gender', 'zipcode' ]

    def validate_gender(self, value):
        if value not in [choice[0] for choice in self.GENDER_CHOICES]:
            raise serializers.ValidationError('Invalid gender choice.')
        return value
    
    def validate_birth_month(self, value):
        if not 1 <= value <= 12:
            raise serializers.ValidationError('Birth month should be between 1 and 12.')
        return value

    def validate_birth_year(self, value):
        current_year = date.today().year
        if current_year - value >= 18:
            raise serializers.ValidationError('Users must be below 18 years old')
        return value

        
class PasswordSerializer(RestAuthPasswordResetSerializer):
    """Custom serializer for rest_auth to solve reset password error"""
    password_reset_form_class = ResetPasswordForm


class ConsentAccessCodeSerializer(serializers.Serializer):

    access_code = serializers.CharField(max_length=100)

    def validate_access_code(self, access_code):
        try:
            access_code = ConsentAccessCode.objects.get(access_code=access_code)
        except ConsentAccessCode.DoesNotExist:
            raise serializers.ValidationError('Invalid access code')
        
        if access_code.is_expired:
            raise serializers.ValidationError('Access code has expired')
        
        return access_code
    

