# Django
from django.urls import path, include
# rest framework
from rest_framework.routers import DefaultRouter
#App
from .views import UserViewSet, GroupViewSet, PermissionViewSet, UserPasswordUpdateAPIView, UserPasswordDefaultAPIView

# Creamos el router local de la app
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
# router.register(r'users_password', UserPasswordUpdateAPIView, basename='users_password')
router.register(r'groups', GroupViewSet)
router.register(r'permissions', PermissionViewSet)

urlpatterns = [
    # Incluimos las rutas del router bajo la raíz de este archivo
    path('', include(router.urls)), 
    path('password_update/', UserPasswordUpdateAPIView.as_view(), name='user_password'), 
    path('default/<int:pk>', UserPasswordDefaultAPIView.as_view(), name='password_default') 
]

