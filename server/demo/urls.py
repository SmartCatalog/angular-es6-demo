from __future__ import absolute_import, unicode_literals

from django.conf.urls import url

from demo.views import LoginView, LogoutView, RegistrationView, UserListView


urlpatterns = [
    url(r'login$', LoginView.as_view(), name = 'login'),
    url(r'register', RegistrationView.as_view(), name = 'register'),
    url(r'logout', LogoutView.as_view(), name = 'logout'),
    url(r'user', UserListView.as_view(), name = 'user-list')
]