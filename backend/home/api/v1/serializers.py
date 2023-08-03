from datetime import date
from django.contrib.auth import get_user_model
from django.http import HttpRequest
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from allauth.account.adapter import get_adapter
from users.models import (  ConsentAccessCode, 
                            Profile, 
                            PrivacyPolicy, 
                            TermAndCondition, 
                            FishGameTrial,
                            Question, 
                            AnswerOption,
                            RankedQualities,
                            TreeShakingGameTrial,
                        )


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
        fields = ['username','age', 'avatar_id', 'consent_status', 'detail_status', 'consent_email']


class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ['birth_month', 'birth_year', 'nationality', 'gender', 'zipcode']

    def to_internal_value(self, data):
        data['birth_month'] = data.get('birth_month') or None
        data['birth_year'] = data.get('birth_year') or None
        return super().to_internal_value(data)

    def validate_birth_month(self, value):
        if value is not None and not 1 <= int(value) <= 12:
            raise serializers.ValidationError('Birth month should be between 1 and 12 or leave it empty.')
        return value

    def validate_birth_year(self, value):
        if value is not None:
            current_year = date.today().year
            if current_year - int(value) >= 18:
                raise serializers.ValidationError('Users must be below 18 years old or leave it empty.')
        return value


class ResetPasswordSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)


class ResetPasswordSessionSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True, max_length=128)


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
    

class PrivacyPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivacyPolicy
        fields = ('body', 'author', 'created_at', 'updated_at')


class TermAndConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TermAndCondition
        fields = ('body', 'author', 'created_at', 'updated_at')


class FishGameTrialSerializer(serializers.ModelSerializer):
    participant = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = FishGameTrial
        fields = ['id','participant', 'trial_number', 'match', 'trial_response_time']

    def to_internal_value(self, data):
        if 'trial_response_time' in data:
            data['trial_response_time'] = str(float(data['trial_response_time']) / 1000)
        return super().to_internal_value(data)


class AnswerOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerOption
        fields = ['id', 'option_text']


class QuestionSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField()
    question_type = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ['id', 'question_text','question_type', 'options']

    def get_options(self, question):
        options = []
        if question.question_type == 'dropdown' or question.question_type == 'multiple_choice':
            for option in question.answer_options.all():
                options.append({
                    'id': option.id,
                    'text': option.option_text
                })
        return options
    
    def get_question_type(self, question):
        question_type = question.question_type
        if question_type == 'text_input':
            return '1'
        elif question_type == 'dropdown':
            return '2'
        elif question_type == 'multiple_choice':
            return '3'
        elif question_type == 'rating':
            return '4'
        return question_type
    
    def validate(self, data):
        question_type = data.get('question_type')
        answer_options = self.context.get('answer_options')

        if question_type == 'dropdown' or question_type == 'multiple_choice':
            if len(answer_options) != 4 or len(answer_options) != 2:
                raise serializers.ValidationError("Two or Four answer options are required for dropdown and multiple-choice questions.")
        
        return data


class QuestionAnswerSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    answer = serializers.ListField(child=serializers.CharField())

    def validate(self, data):
        question_id = data.get('id')
        answer = data.get('answer')

        try:
            question = Question.objects.get(pk=question_id)
        except Question.DoesNotExist:
            raise serializers.ValidationError('Question not found.')

        if question.question_type == 'text_input':
            if len(answer) > 1:
                raise serializers.ValidationError(f'Invalid answer. Blank or One Answer is allowed for text type question.')
        elif question.question_type == 'dropdown':
            if len(answer) != 1:
                raise serializers.ValidationError('Invalid answer. Please select one option for dropdown type question.')
            valid_answer_option_ids = question.answer_options.values_list('id', flat=True)
            if not set(answer).issubset(set(str(opt_id) for opt_id in valid_answer_option_ids)):
                raise serializers.ValidationError('Invalid answer. Answer options are not valid for dropdown question.')
        elif question.question_type == 'multiple_choice':
            valid_answer_option_ids = question.answer_options.values_list('id', flat=True)
            if not set(answer).issubset(set(str(opt_id) for opt_id in valid_answer_option_ids)):
                raise serializers.ValidationError('Invalid answer. Some answer options are not valid for multiple choice question.')
        elif question.question_type == 'rating':
            if len(answer) != 1:
                raise serializers.ValidationError('Invalid answer. Only one answer is allowed for rating type question.')
            if int(answer[0]) not in range(1, 6):
                raise serializers.ValidationError(f'Invalid answer {answer[0]}. Only answers in the range 1-5 are acceptable.')
        else:
            raise serializers.ValidationError('Invalid question type.')

        return data
    
    
class RankedQualitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = RankedQualities
        fields = ['id', 'category', 'rank']


class TreeShakingGameTrialSerializer(serializers.ModelSerializer):
    class Meta:
        model = TreeShakingGameTrial
        fields = ['trial_number', 'shell', 'shared_shell', 'response', 'trial_response_time']

    def to_internal_value(self, data):
        if 'trial_response_time' in data:
            data['trial_response_time'] = str(float(data['trial_response_time']) / 1000)
        return super().to_internal_value(data)



