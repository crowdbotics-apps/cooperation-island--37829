import base64
import datetime
import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _
from allauth.account.models import EmailAddress
from django.utils import timezone 
from django.utils.crypto import get_random_string
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail



class User(AbstractUser):
    # WARNING!
    """
    Some officially supported features of Crowdbotics Dashboard depend on the initial
    state of this User model (Such as the creation of superusers using the CLI
    or password reset in the dashboard). Changing, extending, or modifying this model
    may lead to unexpected bugs and or behaviors in the automated flows provided
    by Crowdbotics. Change it at your own risk.


    This model represents the User instance of the system, login system and
    everything that relates with an `User` is represented by this model.
    """

    # First Name and Last Name do not cover name patterns
    # around the globe.
    name = models.CharField(_("Name of User"), blank=True, null=True, max_length=255)
    identifier = models.UUIDField( default=uuid.uuid4, editable=False, unique=True, db_index=True)
    email = models.EmailField(unique=False)
    age = models.PositiveIntegerField(default=0, blank=True, null=True)
    avatar_id = models.PositiveIntegerField(default=0, blank=True, null=True)
    consent_status = models.BooleanField(default=False)
    detail_status = models.BooleanField(default=False)
    consent_email = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'

    def emailaddress_set(self):
        return EmailAddress.objects.filter(user=self)
    
    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})

    def __str__(self):
        return self.username

class ConsentAccessCode(models.Model):
    access_code = models.CharField(max_length=255, unique=True, verbose_name='Access Code')
    used_by_users = models.ManyToManyField(User, related_name='access_codes_used', blank=True, verbose_name='Used by Users')
    is_expired = models.BooleanField(default=False, verbose_name='Expired')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.access_code
    
class Profile(models.Model):
    """user profile information"""
    participant = models.OneToOneField(User, on_delete=models.CASCADE)
    birth_month = models.IntegerField(blank=True, null=True)
    birth_year = models.IntegerField(blank=True, null=True)
    nationality = models.CharField(max_length=255, blank=True)
    gender = models.CharField(max_length=255, blank=True)
    zipcode = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def save(self, *args, **kwargs):
        self.participant.detail_status = True
        self.participant.save()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.participant.username}'

class EmailVerification(models.Model):
    """send verification email to adult for consent"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    verification_token = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)
    expiry_date = models.DateTimeField()

    def generate_token(self):
        self.verification_token = get_random_string(length=32)
        self.created_at = timezone.now()
        self.expiry_date = self.created_at + timezone.timedelta(days=7)
        self.save()

    def is_token_valid(self, token):
        return (
            self.verification_token == token and
            self.expiry_date > timezone.now()
        )

    def send_verification_email(self):
        current_site = get_current_site(request=None)
        domain = current_site.domain
        # domain='localhost:8000', # set for local
        mail_subject = 'Verify your email'
        message = render_to_string('verification_email.html', {
            'user': self.user,
            'domain': domain,
            'uidb64': urlsafe_base64_encode(force_bytes(self.user.pk)),
            'token': self.verification_token,
            'expiry_date': self.expiry_date
        })
        email = EmailMessage(mail_subject, message, to=[self.user.email])
        email.content_subtype = 'html' 
        email.send()

class PasswordResetSession(models.Model):
    """Resetting user password"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    session_id = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        # Generate a unique session ID for the user
        self.session_id = self.generate_session_id()

        # Calculate expiry time
        self.expires_at = datetime.datetime.now() + datetime.timedelta(hours=1)

        super().save(*args, **kwargs)

        # Send email to the user with the reset URL
        self.send_reset_email_notification()

    def generate_session_id(self):
        username = self.user.username
        timestamp = str(int(datetime.datetime.now().timestamp()))
        session_data = f"{username}_{timestamp}".encode()
        encoded_session_id = base64.urlsafe_b64encode(session_data).decode()
        return encoded_session_id

    def send_reset_email_notification(self):
        current_site = get_current_site(request=None)
        domain = current_site.domain
        reset_url = f"https://{domain}/reset-password/{self.session_id}"
        # reset_url = f"http://localhost:8000/reset-password/{self.session_id}"
        subject = 'Password Reset'
        message = f'Your password reset link is valid for only 1 hour. Click the following link to reset your password: {reset_url}'
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [self.user.email])

class PrivacyPolicy(models.Model):
    body = models.TextField()
    author = models.ForeignKey(User, on_delete=models.PROTECT)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class TermAndCondition(models.Model):
    body = models.TextField()
    author = models.ForeignKey(User, on_delete=models.PROTECT, related_name="author")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class FishGameTrial(models.Model):
    participant = models.ForeignKey(User, on_delete=models.SET_NULL, default=None, null=True, related_name='participant')
    original_participant_id = models.IntegerField(null=True, blank=True)
    trial_number = models.PositiveSmallIntegerField()
    match = models.BooleanField()
    trial_response_time = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        participant_info = f"Participant: {self.participant.id}" if self.participant else "Participant: None"
        return f"Participant: {participant_info} - Trial: {self.trial_number}"

class ActivityFeedback(models.Model):
    activity_type_choices = [
        ('fish-mind-reading', 'Fish Mind Reading'),
        ('tree-shaking', 'Tree Shaking'),
        ('tell-us-about-you', 'Tell Us About You')
    ]
    
    activity_type = models.CharField(max_length=255, choices=activity_type_choices, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.activity_type}"
   
class Question(models.Model):
    question_type_choices = [
        ('text_input', 'Text Input'),
        ('multiple_choice', 'Multiple Choice Question'),
        ('dropdown', 'Dropdown Selection'),
        ('rating', 'Rating'),
    ]

    activity_feedback = models.ForeignKey(ActivityFeedback, on_delete=models.CASCADE, related_name='questions')
    question_text = models.CharField(max_length=255)
    question_type = models.CharField(max_length=100, choices=question_type_choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.question_text}"

    @property
    def answer_options(self):
        return self.answeroption_set.all()


class AnswerOption(models.Model):
    option_text = models.CharField(max_length=255)
    question = models.ForeignKey(
                                    Question, 
                                    related_name='answer_options', 
                                    on_delete=models.CASCADE,
                                 )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.option_text}"
    

class QuestionOrder(models.Model):
    activity_feedback = models.ForeignKey(ActivityFeedback, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    order = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Activity: {self.activity_feedback}, Question: {self.question}, Order: {self.order}"
    

class ParticipantResponse(models.Model):
    participant = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    original_participant_id = models.IntegerField(null=True, blank=True)
    activity_feedback = models.ForeignKey(ActivityFeedback, on_delete=models.PROTECT)
    question = models.ForeignKey(Question, on_delete=models.SET_NULL, null=True)
    original_question_text = models.CharField(blank=True, max_length=255,  default=None, null=True)
    text_answer = models.TextField(blank=True, null=True)
    answer_options = models.ManyToManyField(AnswerOption, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        participant_info = f"Participant: {self.participant.id}" if self.participant else "Participant: None"
        question_info = f"Question : {self.question.question_text}" if self.question else "Question: None"
        return f"Participant: {participant_info}, Question: {question_info}"
    


class RankedQualities(models.Model):
    participant = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    original_participant_id = models.IntegerField(null=True, blank=True)
    quality_choices = [
        (1, 'Being Fair'),
        (2, 'Being Honest'),
        (3, 'Following the rules'),
        (4, 'Being Generous'),
        (5, 'Being funny'),
        (6, 'Being athletic'),
        (7, 'Being artistic'),
        (8, 'Being intelligent'),
        (9, 'Being forgiving'),
        (10, 'Standing up for others'),
        (11, 'Being trustworthy'),
    ]
    category_choices = [
        (1, 'Very Important'),
        (2, 'A Little Important'),
        (3, 'Not That Important'),
    ]
    quality = models.PositiveSmallIntegerField(choices=quality_choices)
    category = models.PositiveSmallIntegerField(choices=category_choices)
    rank = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        participant_info = f"Participant: {self.participant.id}" if self.participant else "Participant: None"
        return f"User: {participant_info}, Quality: {self.quality}, Rank: {self.rank}"

    
class TreeShakingGameTrial(models.Model):
    participant = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='tree_participant')
    original_participant_id = models.IntegerField(null=True, blank=True)
    trial_number = models.PositiveSmallIntegerField()
    shell = models.PositiveIntegerField()
    shared_shell= models.PositiveIntegerField()
    trial_response_time = models.DecimalField(max_digits=10, decimal_places=2)
    response = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        participant_info = f"Participant: {self.participant.id}" if self.participant else "Participant: None"
        return f"Participant: {participant_info} - Trial: {self.trial_number}"


class IndividualRankingQualitiesScore(models.Model):
    participant = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    original_participant_id = models.IntegerField(null=True, blank=True)
    question = models.ForeignKey(Question, on_delete=models.SET_NULL, null=True)
    original_question_text = models.CharField(blank=True, max_length=255, default=None, null=True)
    score = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        participant_info = f"Participant: {self.participant.id}" if self.participant else "Participant: None"
        question_info = f"Question : {self.question.question_text}" if self.question else "Question: None"
        return f"{participant_info} - {question_info}"



