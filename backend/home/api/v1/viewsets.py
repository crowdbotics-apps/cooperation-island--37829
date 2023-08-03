from datetime import datetime
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_text
from django.shortcuts import render
from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.viewsets import ModelViewSet, ViewSet, ReadOnlyModelViewSet
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.authtoken.models import Token
from rest_framework import generics, status
from rest_framework.response import Response
from home.utils import encrypt_payload
from users.models import (  Profile, 
                            EmailVerification, 
                            PasswordResetSession, 
                            PrivacyPolicy, 
                            TermAndCondition, 
                            FishGameTrial,
                            Question,
                            ActivityFeedback,
                            AnswerOption,
                            ParticipantResponse,
                            RankedQualities,
                            IndividualRankingQualitiesScore,
                        )
from home.api.v1.serializers import (
    SignupSerializer,
    UserDetailsSerializer,
    ConsentAccessCodeSerializer,
    UserProfileSerializer,
    ResetPasswordSerializer,
    ResetPasswordSessionSerializer,
    PrivacyPolicySerializer,
    TermAndConditionSerializer,
    FishGameTrialSerializer,
    QuestionSerializer,
    QuestionAnswerSerializer,
    RankedQualitiesSerializer,
    TreeShakingGameTrialSerializer,
)


User = get_user_model()


class ResetPasswordViewSet(ViewSet):
    """Reset-password Functionality"""
    def create(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']

        try:
            user = User.objects.get(username=username)
            session = PasswordResetSession(user=user)
            session.save()
            return Response({'message': 'Password reset initiated successfully. Check your email for further instructions.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    def retrieve(self, request, session_id=None):
        try:
            session = PasswordResetSession.objects.get(session_id=session_id, expires_at__gte=datetime.now())
            username = session.user.username
            return Response({'username': username}, status=status.HTTP_200_OK)
        except PasswordResetSession.DoesNotExist:
            return Response({'message': 'Invalid session ID or session has expired.'}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, session_id=None):
        serializer = ResetPasswordSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_password = serializer.validated_data['new_password']

        try:
            session = PasswordResetSession.objects.get(session_id=session_id, expires_at__gte=datetime.now())
            user = session.user
            user.set_password(new_password)
            user.save()
            session.delete()
            return Response({'message': 'Password updated successfully.'}, status=status.HTTP_200_OK)
        except PasswordResetSession.DoesNotExist:
            return Response({'message': 'Invalid session ID or session has expired.'}, status=status.HTTP_404_NOT_FOUND)


class SignupViewSet(ModelViewSet):
    """User Signup"""
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


class UserDetailView(APIView):
    """Return user details"""
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        serializer = UserDetailsSerializer(user)
        payload=encrypt_payload(serializer.data)
        return Response({"user": payload}, status=200)


class ConsentAccessCodeViewSet(APIView):
    """Access code to give consent to the participant"""

    permission_classes= [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = ConsentAccessCodeSerializer(data=request.query_params, context={'request': request})
        serializer.is_valid(raise_exception=True)
        access_code = serializer.validated_data['access_code']
        
        if request.user.consent_status:
            return Response({'error': 'User consent already verified'}, status=401)
        # if request.user in access_code.used_by_users.all():
        #     return Response({'error': 'Access code already used by this user'}, status=401)
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
    """update avatar_id"""
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


class ProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        try:
            profile = Profile.objects.get(participant=user)
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        profile_serializer = UserProfileSerializer(profile)
        encrypted_payload = encrypt_payload(profile_serializer.data)

        return Response({'profile': encrypted_payload}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        try:
            profile = Profile.objects.get(participant=request.user)
            return Response({'error': 'Profile already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        except Profile.DoesNotExist:
            pass

        serializer = UserProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            profile = serializer.save(participant=request.user)
        except IntegrityError:
            return Response({'error': 'Profile already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user_data = UserDetailsSerializer(request.user).data
        user_encrypted_payload = encrypt_payload(user_data)
        

        return Response({'user': user_encrypted_payload}, status=status.HTTP_201_CREATED)

    def put(self, request, *args, **kwargs):
        user = request.user
        try:
            profile = Profile.objects.get(participant=user)
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileSerializer(profile, data=request.data)
        serializer.is_valid(raise_exception=True)
        updated_profile = serializer.save()

        updated_profile_serializer = UserProfileSerializer(updated_profile)
        encrypted_payload = encrypt_payload(updated_profile_serializer.data)

        return Response({'profile': encrypted_payload}, status=status.HTTP_200_OK)


class UserVerificationView(generics.GenericAPIView):
    def get(self, request, uidb64, token):
        try:
            user_id = force_text(urlsafe_base64_decode(uidb64))
            email_verification = EmailVerification.objects.get(user_id=user_id)
        except (TypeError, ValueError, OverflowError, EmailVerification.DoesNotExist):
            return render(request, 'verification_error.html')
        

        if not email_verification.is_token_valid(token):
            return render(request, 'verification_error.html')

        user = email_verification.user
        user.consent_status = True
        user.save(update_fields=['consent_status'])

        email_verification.delete()
        return render(request, 'verification_success.html')


class EmailConsentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        email_verification = EmailVerification.objects.filter(user=user).first()
        if email_verification: 
            token = email_verification.verification_token
            if email_verification.is_token_valid(token=token): 
                if request.data.get('resend_email', False):
                    try:
                        email_verification.send_verification_email()
                    except Exception as e:
                        print(e, flush=True)
                        return Response({'error': 'Failed to send email'}, status=status.HTTP_400_BAD_REQUEST)
                    user_detail_serializer = UserDetailsSerializer(user)
                    payload=encrypt_payload(user_detail_serializer.data)
                    return Response({'user': payload }, status=status.HTTP_200_OK)
                return Response({'error': 'Consent email is already sent'}, status=status.HTTP_400_BAD_REQUEST)
        email_verification = EmailVerification(user=user)
        email_verification.generate_token()
        email_verification.save()
        try:
            email_verification.send_verification_email()
        except Exception as e:
            print(e, flush=True)
            return Response({'error': 'Failed to send email'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.consent_email=True
        user.save()
        user_detail_serializer = UserDetailsSerializer(user)
        payload=encrypt_payload(user_detail_serializer.data)
        return Response({'user': payload }, status=status.HTTP_200_OK)


class PrivacyPolicyViewSet(ReadOnlyModelViewSet):
    serializer_class = PrivacyPolicySerializer

    def get_queryset(self):
        return PrivacyPolicy.objects.filter(is_active=True).order_by('-created_at')[:1]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if queryset.exists():
            serializer = self.get_serializer(queryset.first())
            return Response(serializer.data)
        
        return Response(status=status.HTTP_400_BAD_REQUEST)
        

class TermAndConditionViewSet(ReadOnlyModelViewSet):
    serializer_class = TermAndConditionSerializer

    def get_queryset(self):
        return TermAndCondition.objects.filter(is_active=True).order_by('-created_at')[:1]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        if queryset.exists():
            serializer = self.get_serializer(queryset.first())
            return Response(serializer.data)
        
        return Response(status=status.HTTP_400_BAD_REQUEST)
    

class FishGameTrialAPIView(generics.ListCreateAPIView):
    queryset = FishGameTrial.objects.all()
    serializer_class = FishGameTrialSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(participant=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        if serializer.is_valid():
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ActivityFeedbackViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def get_activity_feedback(self, activity_type):
        try:
            return ActivityFeedback.objects.get(activity_type=activity_type)
        except ActivityFeedback.DoesNotExist:
            raise ObjectDoesNotExist('Activity feedback not found.')
        
    def get_question(self, question_id):
        try:
            return Question.objects.get(pk=question_id)
        except Question.DoesNotExist:
            raise ObjectDoesNotExist('Question not found.')

    def get(self, request, activity_type=None):
        activity_feedback = self.get_activity_feedback(activity_type)
        
        if activity_type == 'tell-us-about-you':
            questions = activity_feedback.questions.filter(question_type='rating').order_by('questionorder__order')
        else:
            questions = activity_feedback.questions.order_by('questionorder__order')
        
        filtered_questions = []
        for question in questions:
            if activity_type == 'tell-us-about-you':
                if question.question_type == 'rating':
                    filtered_questions.append(question)
            else:
                if question.question_type == 'text_input':
                    filtered_questions.append(question)
                elif question.question_type in ['dropdown', 'multiple_choice']:
                    answer_options_count = question.answer_options.count()
                    if answer_options_count == 2 or answer_options_count == 4:
                        filtered_questions.append(question)

        serializer = QuestionSerializer(filtered_questions, many=True) 
        
        return Response(serializer.data)

    def post(self, request, activity_type=None):
        activity_feedback = self.get_activity_feedback(activity_type)
        serializer = QuestionAnswerSerializer(data=request.data, context={'participant': request.user})
        
        if serializer.is_valid():
            question_id = serializer.validated_data['id']
            answer = serializer.validated_data['answer']

            question = self.get_question(question_id)
            
            if activity_type == 'tell-us-about-you':
                if question.question_type == 'rating':
                    score = int(answer[0])
                    participant_score = IndividualRankingQualitiesScore(
                        participant=request.user,
                        question=question,
                        score=score,
                    )
                    participant_score.save()
                    return Response({'detail': 'Response submitted successfully.'}, status=status.HTTP_200_OK)
                else:
                    return Response({'error': 'Invalid question type for this activity type.'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                if question.question_type == 'text_input':
                    text_answer = answer[0] if answer else None
                    participant_response = ParticipantResponse(
                        participant=request.user,
                        activity_feedback=activity_feedback,
                        question=question,
                        text_answer=text_answer,
                    )
                    participant_response.save()
                else:
                    participant_response = ParticipantResponse(
                        participant=request.user,
                        activity_feedback=activity_feedback,
                        question=question,
                    )
                    participant_response.save()

                    answer_options = AnswerOption.objects.filter(id__in=answer)
                    participant_response.answer_options.set(answer_options)


                return Response({'detail': 'Response submitted successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RankedQualitiesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        ranked_qualities = request.data
        user = request.user

        try:
            for ranked_quality in ranked_qualities:
                quality = ranked_quality['id']
                category = ranked_quality['category']
                rank = ranked_quality['rank']

                if quality not in dict(RankedQualities.quality_choices):
                    return Response(f"Invalid quality choice: {quality}", status=status.HTTP_400_BAD_REQUEST)

                RankedQualities.objects.create(participant=user, quality=quality, category=category, rank=rank)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

        return Response("Ranked qualities saved successfully.", status=status.HTTP_200_OK)
    

class TreeShakingGameTrialView(APIView):
    serializer_class = TreeShakingGameTrialSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        participant = request.user
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(participant=participant)
            return Response(status=status.HTTP_200_OK) 
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)







