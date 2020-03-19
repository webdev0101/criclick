from django.contrib.auth.base_user import BaseUserManager
from datetime import datetime

from django.utils import timezone
from django.utils.crypto import get_random_string


class UserManager(BaseUserManager):
    def _create_user(self, email, password, is_staff, is_superuser, **extra_fields):
        if not email:
            raise ValueError('user must have email address')
        now = timezone.now()
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            is_staff=is_staff,
            is_active=True,
            is_superuser=is_superuser,
            last_login=now,
            date_joined=now,
            **extra_fields
        )
        # We check if password has been given

        if password:
            user.set_password(password)
        else:
            user.set_password(get_random_string(length=32))
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        user = self._create_user(email, password, False, False, **extra_fields)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        user = self._create_user(email, password, True, True, **extra_fields)
        user.email_verified_at = datetime.now()
        user.save(using=self._db)
