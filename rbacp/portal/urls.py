from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *

urlpatterns = [
    path("auth/token/", TokenObtainPairView.as_view()),
    path("auth/token/refresh/", TokenRefreshView.as_view()),
    path("me/", MeView.as_view()),
    path( "dashboard/",dashboard.as_view()),
    path("groundops/",groundops.as_view()),
    path ("maintenance/",maintenance.as_view()),
    path("users/",users.as_view()),
]

