from __future__ import absolute_import, unicode_literals

from datetime import datetime

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models, transaction

from rest_framework_jwt.settings import api_settings


class UserManager(BaseUserManager):

    def _generate_token(self, user):
        return api_settings.JWT_ENCODE_HANDLER({
            'username': user.username,
            'email': user.email,
            'time': datetime.now().strftime('%c')
        })

    def get_by_natural_key(self, username):
        return self.get(username = username)

    @transaction.atomic
    def create_user(self, username, password, **kwargs):
        email = self.normalize_email(kwargs.get('email'))
        if not email:
            raise ValueError('User must have valid email address')

        account = self.model(username = username,
                             password = password,
                             email = email,
                             first_name = kwargs.get('first_name', ''),
                             last_name = kwargs.get('last_name', ''))

        account.set_password(password)
        account.token = self._generate_token(account)
        account.last_login = datetime.now()
        account.save()
        return account

    @transaction.atomic
    def create_superuser(self, username, password = None, **kwargs):
        account = self.create_user(username, password, **kwargs)
        account.is_admin = True
        account.save()
        return account


class DemoUser(AbstractBaseUser):
    username = models.CharField(max_length = 100, unique = True)
    email = models.EmailField(unique = True)
    first_name = models.CharField(max_length = 40, blank = True, default = '')
    last_name = models.CharField(max_length = 40, blank = True, default = '')
    token = models.CharField(max_length = 255, default = '')

    objects = UserManager()

    USERNAME_FIELD = 'username'

    def _generate_token(self):
        return api_settings.JWT_ENCODE_HANDLER({
            'username': self.username,
            'email':    self.email,
            'time':     datetime.now().strftime('%c')
        })

    def generate_token(self):
        self.token = self._generate_token()
        self.save()

    class Meta:
        db_table = 'demo_user'

    def __unicode__(self):
        return '[Username: {}] [Email: {}]'.format(self.username, self.email)
