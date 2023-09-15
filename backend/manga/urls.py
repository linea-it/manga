"""manga URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.decorators.csrf import csrf_exempt
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

from activity_statistic.views import ActivityStatisticViewSet
from common.views import LogoutView, UserViewSet, contact_us, send_statistic_email
from galaxy.views import ImageViewSet

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r"users", UserViewSet)

router.register(r"images", ImageViewSet)

# Statistics API
router.register(r"statistics", ActivityStatisticViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/obtain-auth-token/", csrf_exempt(obtain_auth_token)),
    path("api/auth/", include("rest_framework.urls")),
    re_path(r"api/contact/", contact_us),
    re_path(r"^api/logout/", LogoutView),
    re_path(r"^api/send_statistic_email/", send_statistic_email),
]
