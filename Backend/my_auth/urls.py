# Django
from django.urls import path
# JWT Views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView

from .views import MyTokenView, LoginHistoryApiVIew

urlpatterns = [
    # Incluimos las rutas del router bajo la raíz de este archivo
    # Auth / JWT
    # path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Login
    path('login/', MyTokenView.as_view(), name='token_obtain_pair'), # Login
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Refresh token
    path('logout/', TokenBlacklistView.as_view(), name='token_blacklist'), # Logout
    path('login-history/', LoginHistoryApiVIew.as_view(), name='login_history'), # Logout
]
