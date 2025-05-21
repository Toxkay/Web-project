from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Favorite
from recipes.models import Recipe
from django.http import JsonResponse

@login_required
def favorites(request):
    favorite_objects = Favorite.objects.filter(user=request.user)
    user_favorites_ids = [fav.recipe.id for fav in favorite_objects]
    return render(request, "favorites.html", {"favorite_recipes": favorite_objects, "user_favorites_ids": user_favorites_ids})

@login_required
def add_to_favorites(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        favorite, created = Favorite.objects.get_or_create(user=request.user, recipe=recipe)
        return JsonResponse({'status': 'added' if created else 'exists', 'recipe_id': recipe.id})
    Favorite.objects.get_or_create(user=request.user, recipe=recipe)
    return redirect(request.META.get('HTTP_REFERER', 'home'))

@login_required
def remove_from_favorites(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        deleted_count, _ = Favorite.objects.filter(user=request.user, recipe=recipe).delete()
        return JsonResponse({'status': 'removed' if deleted_count > 0 else 'notfound', 'recipe_id': recipe.id})
    Favorite.objects.filter(user=request.user, recipe=recipe).delete()
    return redirect(request.META.get('HTTP_REFERER', 'home'))
