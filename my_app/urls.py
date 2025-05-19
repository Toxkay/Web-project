from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='index'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('add_recipe/', views.add_recipe, name='add_recipe'),
    path('delete_recipe/<int:recipe_id>/', views.delete_recipe, name='delete_recipe'),
    path('search/', views.search, name='search'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('recipes/', views.recipes, name='recipes'),
    path('about/', views.about, name='about'),
    path('favorites/', views.favorites, name='favorites'),
    path('recipe/<int:recipe_id>/', views.recipe_details_page, name='recipe-details'),
    path('recipe/<int:recipe_id>/', views.recipe_details_page, name='recipe-details-page'),
    path('api/recipe/<int:recipe_id>/', views.recipe_detail_api, name='recipe-detail-api'),
    path('api/recipes/', views.recipe_list_api, name='recipe-list-api'),
]
