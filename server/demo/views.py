from __future__ import absolute_import, unicode_literals

import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from demo.models import DemoUser, UserManager
from demo.serializers import DemoUserSerializer


class BaseView(APIView):
    def __init__(self):
        self.logger = logging.getLogger('django')

    def response(self, msg, status_response):
        return Response({'msg': msg}, status = status_response)


class LogoutView(BaseView):
    def __init__(self):
        BaseView.__init__(self)

    def post(self, request):
        try:
            user = DemoUser.objects.get(token = request.auth)
            user.token = ''
            user.save()
            return Response(status.HTTP_204_NO_CONTENT)

        except DemoUser.DoesNotExist:
            self.logger.error('User id does not exist for token [{}]'.format(request.auth))
            return self.response('User with token does not exist', status.HTTP_404_NOT_FOUND)


class RegistrationView(BaseView):
    def __init__(self):
        BaseView.__init__(self)

    def post(self, request):
        serializer = DemoUserSerializer(data = request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status.HTTP_201_CREATED)
        else:
            return self.response(serializer.errors, status.HTTP_406_NOT_ACCEPTABLE)


class LoginView(BaseView):
    def __init__(self):
        BaseView.__init__(self)

    def authenticate(self, username, password):
        if username and password:
            try:
                user = DemoUser.objects.get(username = username)
                if user and user.check_password(password):
                    return user, ''
                return None, 'Password invalid for this user'
            except DemoUser.DoesNotExist:
                self.logger.error('User with username [{}] foes not exist'.format(username))
                return None, 'Username does not exist'

        return None, 'Invalid Credentials'

    def post(self, request):
        data = request.data
        username = data.get('username', None)
        password = data.get('password', None)
        user, message = self.authenticate(username, password)

        if user is None:
            return self.response(message, status.HTTP_401_UNAUTHORIZED)

        if user.is_active:
            user.generate_token()
            serializer = DemoUserSerializer(user)
            return Response(serializer.data, status.HTTP_200_OK)

        return self.response('Account is disabled, contact administration', status.HTTP_401_UNAUTHORIZED)


class UserListView(BaseView):
    def __init__(self):
        BaseView.__init__(self)

    def get(self):
        user_list = DemoUser.objects.all()
        serialized = DemoUserSerializer(user_list, many = True)
        return Response(serialized.data, status = status.HTTP_200_OK)

