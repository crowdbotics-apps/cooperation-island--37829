import jwt
from django.conf import settings
from datetime import timedelta
from google.cloud import storage
from google.cloud.exceptions import NotFound
from io import BytesIO
import requests
from PIL import Image as PILImage
import requests
import img2pdf 


def encrypt_payload(payload):
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token


def generate_signed_url(avatar_id, theme_id, image_type):
    folder = 0 if image_type=='color' else 1
    object_name = f"{avatar_id}_{theme_id}.jpg"
    storage_client = storage.Client(credentials=settings.GS_CREDENTIALS)
    bucket = storage_client.bucket(settings.GS_BUCKET_NAME)
    blob = bucket.blob(f"{folder}/{object_name}")

    url = blob.generate_signed_url(version="v4",expiration=timedelta(minutes=15),method="GET")

    return url


def convert_image_to_pdf(image_url):
    try:
        response = requests.get(image_url)
        if response.status_code != 200:
            raise Exception(f"Failed to download image: Status code {response.status_code}")

        pdf_bytes = img2pdf.convert(BytesIO(response.content))

        return pdf_bytes
    except Exception as e:
        raise Exception(f"Failed to convert image to PDF: {str(e)}")
    


# def convert_image_to_pdf(image_url):
#     try:
#         response = requests.get(image_url)
#         if response.status_code != 200:
#             raise Exception(f"Failed to download image: Status code {response.status_code}")

#         img = PILImage.open(BytesIO(response.content))
#         pdf_buffer = BytesIO()
#         img.save(pdf_buffer, format='PDF', resolution=100.0)
#         pdf_bytes = pdf_buffer.getvalue()

#         return pdf_bytes
#     except Exception as e:
#         raise Exception(f"Failed to convert image to PDF: {str(e)}")



