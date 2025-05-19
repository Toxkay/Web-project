from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='index'),
    path('search/', views.search, name='search'),
    path('recipes/', views.recipes, name='recipes'),
    path('about/', views.about, name='about'),
    path('favorites/', views.favorites, name='favorites'),
    path('recipe/<int:recipe_id>/', views.recipe_details_page, name='recipe-details'),
    path('recipe/<int:recipe_id>/', views.recipe_details_page, name='recipe-details-page'),
    path('api/recipe/<int:recipe_id>/', views.recipe_detail_api, name='recipe-detail-api'),
    path('api/recipes/', views.recipe_list_api, name='recipe-list-api'),
]
