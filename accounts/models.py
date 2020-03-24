import base64
import os

from django.contrib.auth.models import AbstractUser
from django.contrib.gis.db import models

# Create your models here.
from django.utils.crypto import get_random_string
from twilio.rest import Client

from accounts.managers import UserManager
from criclick import settings
from criclick.storage import OverwriteStorage


class User(AbstractUser):
    email = models.EmailField(unique=True)
    email_verify_code = models.CharField(blank=True, null=True, max_length=6)
    email_verified_at = models.DateTimeField(blank=True, null=True)
    phone = models.CharField(blank=True, null=True, max_length=32)
    phone_verify_code = models.CharField(blank=True, null=True, max_length=6)
    phone_verified_at = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

    def sms_to_verify(self):
        code = get_random_string(length=6, allowed_chars='1234567890')
        self.phone_verify_code = code
        self.save()
        account_sid = "ACeccb777f6e14289461aafbb5d5241473"
        auth_token = "285c401f8ee4096d9738064f9f40c2b7"
        client = Client(account_sid, auth_token)
        message = client.messages.create(
            to=self.phone,
            from_="+16672132798",
            body='Hi, thanks for Joining to CRICLICK. Verification code: ' + code,
        )
        print(message.sid)
        return message.sid


def avatar_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'user_{0}/avatar/{1}'.format(instance.user.id, filename)


def banner_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'user_{0}/banner/{1}'.format(instance.user.id, filename)


def image_as_base64(image_file, image_format='png'):
    if not os.path.isfile(image_file):
        return None
    with open(image_file, 'rb') as img_f:
        encoded_string = base64.b64encode(img_f.read())
    return 'data:image/%s;base64,%s' % (image_format, encoded_string.decode('utf-8'))


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(blank=True, null=True, upload_to=avatar_directory_path)
    # avatar_icon = models.ImageField(blank=True, null=True, upload_to=avatar_directory_path)
    # avatar_origin = models.ImageField(blank=True, null=True, upload_to=avatar_directory_path)
    banner = models.ImageField(blank=True, null=True, upload_to=banner_directory_path)
    # banner_origin = models.ImageField(blank=True, null=True, upload_to=banner_directory_path)
    background_color = models.CharField(default='#ffffff', max_length=10)
    location = models.CharField(max_length=191, blank=True, null=True)
    latlng = models.PointField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user_id

    def get_original_avatar_base64(self):
        return image_as_base64(self.avatar_origin.path)

    def get_original_banner_base64(self):
        return image_as_base64(self.banner_origin.path)
