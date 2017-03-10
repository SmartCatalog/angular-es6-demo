from __future__ import absolute_import, unicode_literals

from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from demo.models import DemoUser


class DemoUserTests(APITestCase):

    def setUp(self):
        self.test_admin = DemoUser.objects.create(username = 'test_admin',
                                                  password = 'test_password',
                                                  email = 'test_email@gmail.com')

        self.test_admin.save()
        self.client = APIClient()

    def test_create_account(self):
        user_data = {
            'username': 'test_user',
            'password': 'test_password',
            'email': 'test_user@gmail.com',
            'first_name': 'test',
            'last_name': 'user'
        }
        response = self.client.post('/api/v1/register', user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user_data = {
            'username':   'another_test_user',
            'password':   'test_password',
            'email':      'another_email.gmail.com',
        }

        response = self.client.post('/api/v1/register', user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.post('/api/v1/register', user_data)
        self.assertEqual(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)


    def test_login_account(self):
        response = self.client.post('/api/v1/login', {'username': self.test_admin.username,
                                                      'password': self.test_admin.password})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_user_list(self):
        response = self.client.get('/api/v1/user', {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
