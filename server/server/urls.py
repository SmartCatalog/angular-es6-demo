from __future__ import absolute_import, unicode_literals

from django.conf.urls import include, url

urlpatterns = [
    url(r'^api/v1/', include('demo.urls')),
    url(r'^api/v1/docs/', include('rest_framework_docs.urls'))
]
