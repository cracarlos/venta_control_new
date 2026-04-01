# Django
from django.urls import path, include
# rest framework
from rest_framework.routers import DefaultRouter
#App
from .views import ProductViewSet

# Creamos el router local de la app
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')
urlpatterns = [
    path('', include(router.urls)), 
]