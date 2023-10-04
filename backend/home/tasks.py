from celery import shared_task
from django.core.mail import EmailMessage
from .utils import convert_image_to_pdf, generate_signed_url
from django.conf import settings 
from django.contrib.auth import get_user_model
from users.models import ThemeImage

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

        email = EmailMessage(
            f'{theme.name} Theme Images as PDF',
            f'Here are your {theme.name} theme images as PDF attachments.',
            f'{settings.DEFAULT_FROM_EMAIL}',  
            [user.email], 
        )
        email.attach(f'{theme.name}_colored_theme.pdf', color_pdf_data, 'application/pdf')
        email.attach(f'{theme.name}_outline_theme.pdf', outline_pdf_data, 'application/pdf')

        email.send()

    except Exception as e:
        pass

