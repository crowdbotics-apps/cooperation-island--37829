from django.core.mail import EmailMessage
from django.conf import settings 
from django.contrib.auth import get_user_model
from celery import shared_task
from .utils import convert_image_to_pdf, generate_signed_url
from users.models import ThemeImage, ThemeEmailConfiguration

User=get_user_model()


@shared_task
def generate_and_send_theme_pdf(user_id, theme_id):
    try:
        user = User.objects.get(id=user_id)
        theme = ThemeImage.objects.filter(title=theme_id).first()
        if not theme:
            return

        color_theme_image_url = generate_signed_url(user.avatar_id, theme.title, image_type='color')
        outline_theme_image_url = generate_signed_url(user.avatar_id, theme.title, image_type='outline')

        color_pdf_data = convert_image_to_pdf(color_theme_image_url)

        outline_pdf_data = convert_image_to_pdf(outline_theme_image_url)

        email_config = ThemeEmailConfiguration.objects.filter(is_active=True).first()

        if email_config:
            email = EmailMessage(
                f'{email_config.subject}',
                f'{email_config.body}',
                f'{settings.DEFAULT_FROM_EMAIL}',  
                [user.email], 
            )
            email.attach(f'{theme.name}_colored_theme.pdf', color_pdf_data, 'application/pdf')
            email.attach(f'{theme.name}_outline_theme.pdf', outline_pdf_data, 'application/pdf')

            email.send()

    except Exception as e:
        pass

