"""
URL configuration for venta_control project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
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
from django.urls import path, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

from users.urls import router as users_router
from products.urls import router as products_router
from tasa.views import TasaDolarView, TasaEuroView

router = DefaultRouter()
router.registry.extend(users_router.registry)
router.registry.extend(products_router.registry)

urlpatterns = [
    # API Routes
    path('api/v1/', include(router.urls)),
    path('api/v1/sales/', include('sales.urls')),
    path('api/v1/auth/', include('my_auth.urls')),
    path('api/v1/user-password/', include('users.urls')),
    path('api/v1/password/', include('users.urls')),
    path('api/v1/tasa/dolar/', TasaDolarView.as_view(), name='tasa-dolar'),
    path('api/v1/tasa/euro/', TasaEuroView.as_view(), name='tasa-euro'),
    
    #login browsable
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),

    # Documentation (Swagger)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
