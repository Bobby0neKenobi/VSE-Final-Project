from django.urls import path
from .views import UserView, LoginView, GraphView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', LoginView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', UserView.as_view()),
    path('graph', GraphView.as_view()),
]
