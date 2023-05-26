import jwt
from django.conf import settings
from datetime import datetime, timedelta

def encrypt_payload(payload):
    # Generate the JWT token using the payload and secret key
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token