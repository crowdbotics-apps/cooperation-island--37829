import uuid
from datetime import datetime
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_text
from django.shortcuts import render, get_object_or_404
from django.db import IntegrityError
from django.db.models import OuterRef, Subquery, Q
from rest_framework.viewsets import ModelViewSet, ViewSet, ReadOnlyModelViewSet
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.authtoken.models import Token
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from home.utils import encrypt_payload, generate_signed_url
from home.tasks import generate_and_send_theme_pdf
from users.models import (  Profile, 
                            EmailVerification, 
                            PasswordResetSession, 
                            PrivacyPolicy, 
                            TermAndCondition, 
                            ActivityFeedback,
                            AnswerOption,
                            ParticipantResponse,
                            RankedQualities,
                            IndividualRankingQualitiesScore,
                            IncentiveRangeSelection,
                            FishGameDistribution,
                            TreeShakingDistributionTrials,
                            DynamicPrompt,
                            DynamicPromptResponse,
                            PurchaseHistory,
                            ThemeImage,
                            ConsentEmailConfiguration,
                            QuestionOrder,
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
    TreeShakingGameTrialSerializer,
    ThemeSerializer,
    BuyThemeSerializer,
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
            user = User.objects.get(id=user_id)
            email_verification = EmailVerification.objects.get(user=user)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return render(request, 'verification_error.html')
        # except EmailVerification.DoesNotExist:
        #     return render(request, 'verification_error.html')

        if user.consent_status:
            return render(request, 'verification_repeat.html')

        if not email_verification.is_token_valid(token=token):
            return render(request, 'verification_error.html')
        
        user.consent_status = True
        user.save(update_fields=['consent_status'])

        email_verification.delete()
        return render(request, 'verification_success.html')



class EmailConsentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        email_template = ConsentEmailConfiguration.objects.filter(is_active=True).first()

        if not email_template:
            return Response({'error': 'No active email template found.'}, status=status.HTTP_400_BAD_REQUEST)
        
        email_verification = EmailVerification.objects.filter(user=user).first()
        if email_verification and email_verification.is_token_valid(token=email_verification.verification_token):
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
        
        email_verification = EmailVerification(user=user, email_template=email_template)
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


class ActivityFeedbackViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def get_activity_feedback(self, activity_type):
        try:
            return ActivityFeedback.objects.get(activity_type=activity_type)
        except ActivityFeedback.DoesNotExist:
            raise ValidationError('Activity feedback not found.', code=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request, activity_type=None):
        try:
            activity_feedback = self.get_activity_feedback(activity_type)
        except ValidationError as e:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        question_order_subquery = QuestionOrder.objects.filter(
            activity_feedback=OuterRef('activity_feedback'),
            question=OuterRef('pk')
        ).values('order')[:1]

       
        questions = activity_feedback.questions.annotate(
            question_order=Subquery(question_order_subquery)
        ).filter(
            Q(question_type='text_input') | (
                Q(question_type__in=['dropdown', 'multiple_choice']) & (
                    Q(question_order__isnull=False, activity_feedback__activity_type='voice-your-values') |
                    Q(activity_feedback__activity_type=activity_type)
                )
            ),
            question_order__isnull=False
        ).order_by('question_order')

        filtered_questions = []
        for question in questions:
            if question.question_type == 'text_input':
                filtered_questions.append(question)
            elif question.question_type in ['dropdown', 'multiple_choice']:
                answer_options_count = question.answer_options.count()
                if answer_options_count == 2 or answer_options_count == 4:
                    filtered_questions.append(question)

        serializer = QuestionSerializer(filtered_questions, many=True)

        return Response(serializer.data)

    def post(self, request, activity_type=None):
        try:
            activity_feedback = self.get_activity_feedback(activity_type)
        except ValidationError as e:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = QuestionAnswerSerializer(data=request.data, context={'participant': request.user})
        
        if serializer.is_valid():
            question_id = serializer.validated_data['id']
            answer = serializer.validated_data['answer']
            session_id = serializer.validated_data['session_id']

            question = self.get_question(question_id)
            
            if activity_type == 'voice-your-values':
                if question.question_type == 'rating':
                    score = int(answer[0]) if answer else None
                    if score is not None:  
                        participant_score = IndividualRankingQualitiesScore(
                            participant=request.user,
                            question=question,
                            score=score,
                            session_id=session_id,
                        )
                        participant_score.save()
                        return Response({'detail': 'Response submitted successfully.'}, status=status.HTTP_200_OK)
                    else:
                        return Response({'error': 'Invalid score provided.'}, status=status.HTTP_400_BAD_REQUEST)
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
                        session_id=session_id,
                    )
                    participant_response.save()
                else:
                    participant_response = ParticipantResponse(
                        participant=request.user,
                        activity_feedback=activity_feedback,
                        question=question,
                        session_id=session_id
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
                session_id = ranked_quality['session_id']

                if quality not in dict(RankedQualities.quality_choices):
                    return Response(f"Invalid quality choice: {quality}", status=status.HTTP_400_BAD_REQUEST)

                RankedQualities.objects.create(participant=user, quality=quality, category=category, rank=rank, session_id=session_id)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

        return Response("Ranked qualities saved successfully.", status=status.HTTP_200_OK)
    

class FishGameTrialAPIView(APIView):
    serializer_class = FishGameTrialSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        participant = request.user
        stakes_type = IncentiveRangeSelection.objects.latest('id').stake_level_selected
        fish_distribution = FishGameDistribution.objects.get(stake_level=stakes_type)
        stakes_min = fish_distribution.min
        stakes_max = fish_distribution.max
        participant_shell = participant.shells
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(participant=participant, stakes_type=stakes_type,stakes_min=stakes_min, stakes_max= stakes_max, participant_shell=participant_shell )
            user = request.user
            data = serializer.validated_data
            if data['match'] == True:
                user.shells += data['shell']
                user.save()
            
            user_detail_serializer = UserDetailsSerializer(user)
            payload=encrypt_payload(user_detail_serializer.data)
            response_data = {
                'user': payload
            }
            return Response(response_data, status=status.HTTP_200_OK) 
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)



class TreeShakingGameTrialView(APIView):
    serializer_class = TreeShakingGameTrialSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        participant = request.user
        stakes_type = IncentiveRangeSelection.objects.latest('id').stake_level_selected
        tree_shaking_distribution = tree_shaking_distributions = TreeShakingDistributionTrials.objects.filter(tree_game_level__stake_level=stakes_type)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(participant=participant, stakes_type=stakes_type)
            user = request.user
            data = serializer.validated_data
            if data['response'] == True:
                number = data['shell'] - data['shared_shell']
                user.shells += number
                user.save()
            user_detail_serializer = UserDetailsSerializer(user)
            payload=encrypt_payload(user_detail_serializer.data)
            response_data = {
                'user': payload
            }
            return Response(response_data, status=status.HTTP_200_OK) 
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class DataGenerateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, activity_name):
        response_data = {'session_id': str(uuid.uuid4())}

        if activity_name == 'theme':
            themes = ThemeImage.objects.all()
            serializer = ThemeSerializer(themes, many=True)
            response_data['themes'] = serializer.data

        else:
            try:
                latest_stake_selection = IncentiveRangeSelection.objects.latest('id')
                stake_level = latest_stake_selection.stake_level_selected
            except IncentiveRangeSelection.DoesNotExist:
                return Response({'error': 'Incentive range doesn\'t exist'}, status=status.HTTP_400_BAD_REQUEST)

            if activity_name == 'fish-mind-reading':
                try:
                    fish_distribution = FishGameDistribution.objects.get(stake_level=stake_level)
                    response_data['min'] = fish_distribution.min
                    response_data['max'] = fish_distribution.max
                except FishGameDistribution.DoesNotExist:
                    response_data['min'] = 0
                    response_data['max'] = 0

            elif activity_name == 'tree-shaking':
                tree_shaking_distributions = TreeShakingDistributionTrials.objects.filter(tree_game_level__stake_level=stake_level)
                trials = [{'self': entry.self_distribution, 'partner': entry.partner_distribution} for entry in tree_shaking_distributions]

                # Ensure exactly 24 trials or pad with zeros
                trials += [{'self': 0, 'partner': 0}] * (24 - len(trials))
                trials = trials[:24]
                response_data['trials'] = trials

            elif activity_name == 'voice-your-values':
                pass

            else:
                return Response({'error': 'Invalid activity name'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(response_data)
    

class DynamicPromptAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, activity_name):
        try:
            activity = ActivityFeedback.objects.get(activity_type=activity_name)
            prompts = DynamicPrompt.objects.filter(activity=activity, is_active=True)
            data = [{'id': prompt.id, 'prompt_text': prompt.prompt_text} for prompt in prompts]
            return Response(data)
        except ActivityFeedback.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, activity_name):
        try:
            activity = ActivityFeedback.objects.get(activity_type=activity_name)
            data = request.data
            prompt_id = data.get('id')
            session_id = data.get('session_id')
            
            if not prompt_id or not session_id:
                return Response({'error': 'Both id and session_id are required.'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                prompt = DynamicPrompt.objects.get(id=prompt_id, activity=activity)
            except DynamicPrompt.DoesNotExist:
                return Response({'error': 'Prompt not found for the given activity and id.'}, status=status.HTTP_404_NOT_FOUND)

            DynamicPromptResponse.objects.create(dynamic_prompt=prompt, session_id=session_id, activity=activity, participant=request.user)   

            return Response(status=status.HTTP_200_OK)
        except ActivityFeedback.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST) 
        

class BuyThemeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = BuyThemeSerializer(data=request.data)
        if serializer.is_valid():
            session_id = serializer.validated_data['session_id']
            theme_image_id = serializer.validated_data['theme_id']
            theme_image = ThemeImage.objects.get(title=theme_image_id)

            try:
                theme_image = ThemeImage.objects.get(title=theme_image_id)
            except ThemeImage.DoesNotExist:
                return Response({'error': 'Theme not found'}, status=status.HTTP_400_BAD_REQUEST)    

            user = request.user
            if PurchaseHistory.objects.filter(participant=user, theme_purchased=theme_image).exists():
                return Response({'detail': 'You have already purchased this theme.'}, status=status.HTTP_400_BAD_REQUEST)

            if user.shells < theme_image.price:
                return Response({'detail': 'You do not have enough shells to purchase this theme.'}, status=status.HTTP_400_BAD_REQUEST)

            purchase_record = PurchaseHistory(
                session_id=uuid.uuid4(),
                participant=user,
                theme_purchased=theme_image,
                purchase_cost=theme_image.price,
                participant_shell_at_purchase=user.shells,
            )
            purchase_record.save()

            user.shells -= theme_image.price
            user.save()

            user.purchased_themes.add(theme_image)
            user.save()

            signed_url = generate_signed_url(user.avatar_id, theme_image_id, image_type='color')

            user_detail_serializer = UserDetailsSerializer(user)
            payload=encrypt_payload(user_detail_serializer.data)

            if signed_url:
                return Response({'url': signed_url, 'user': payload}, status=status.HTTP_200_OK)
            else:
                Response({"error":"Object not found"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ThemeDetailsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def user_has_purchased_theme(self, user, theme):
        return user.purchased_themes.filter(title=theme.title).exists()

    def get(self, request):
        theme_id = request.query_params.get('theme_id')

        try:
            theme_image = ThemeImage.objects.get(title=theme_id)
        except ThemeImage.DoesNotExist:
            return Response({'error': 'Theme not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        if not self.user_has_purchased_theme(user, theme_image):
            return Response({'error': 'You have not purchased this theme'}, status=status.HTTP_400_BAD_REQUEST)

        signed_url = generate_signed_url(request.user.avatar_id, theme_id, image_type='color')

        if signed_url:
            return Response({'url': signed_url}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Failed to generate signed URL'}, status=status.HTTP_400_BAD_REQUEST)


class SendThemeAsPdfView(APIView):
    permission_classes = [IsAuthenticated]

    def get_theme(self, theme_id):
        return ThemeImage.objects.filter(title=theme_id).first()
    
    def user_has_purchased_theme(self, user, theme):
        return user.purchased_themes.filter(title=theme.title).exists()

    def post(self, request, theme_id):
        try:
            theme = self.get_theme(theme_id)
            if not theme:
                return Response({'error': 'Theme not found'}, status=status.HTTP_404_NOT_FOUND)
            
            user = request.user
            if not self.user_has_purchased_theme(user, theme):
                return Response({'error': 'You have not purchased this theme'}, status=status.HTTP_400_BAD_REQUEST)

            generate_and_send_theme_pdf.delay(user.id, theme_id)
 

            return Response({'message': 'Email sent successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        



