from __future__ import absolute_import, unicode_literals

from rest_framework.serializers import CharField, ModelSerializer

from demo.models import DemoUser


class DemoUserSerializer(ModelSerializer):
    password = CharField(write_only = True, required = False)
    confirm_password = CharField(required = False)

    class Meta:
        model = DemoUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'token', 'password', 'confirm_password')
        read_only_fields = ('confirm_password', )

    def create(self, validate_data):
        return DemoUser.objects.create_user(**validate_data)
