from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='index'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('add_recipe/', views.add_recipe, name='add_recipe'),
]
