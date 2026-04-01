# Django
from django.urls import path, include
# rest framework
from rest_framework.routers import DefaultRouter
#App
from .views import SalesManagerApiVIew, SalesReportPdfView, DashboardStatsView, SalesTypeListCreateView, SalesTypeRetrieveUpdateDestroyView

urlpatterns = [
    path('', SalesManagerApiVIew.as_view(), name='sales-manager'), 
    path('report/pdf/', SalesReportPdfView.as_view(), name='sales-report-pdf'),
    path('dashboard/', DashboardStatsView.as_view(), name='sales-dashboard'),
    path('types/', SalesTypeListCreateView.as_view(), name='sales-type-list-create'),
    path('types/<int:pk>/', SalesTypeRetrieveUpdateDestroyView.as_view(), name='sales-type-detail'),
]