from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _
from allauth.account.models import EmailAddress
import uuid

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
    identifier = models.UUIDField( default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=False)
    age = models.PositiveIntegerField(default=0, blank=True, null=True)
    avatar_id = models.PositiveIntegerField(default=0, blank=True, null=True)
    consent_status = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'

    def emailaddress_set(self):
        return EmailAddress.objects.filter(user=self)
    
    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})

    def __str__(self):
        return self.username


class ConsentAccessCode(models.Model):
    access_code = models.CharField(max_length=100, unique=True, verbose_name='Access Code')
    used_by_users = models.ManyToManyField(User, related_name='access_codes_used', blank=True, verbose_name='Used by Users')
    is_expired = models.BooleanField(default=False, verbose_name='Expired')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.access_code