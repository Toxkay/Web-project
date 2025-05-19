from django.shortcuts import redirect, render
from django.http import HttpResponse, JsonResponse, Http404
from .models import Recipe
from django.db.models import Q
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User

# Home page: show top 3 recipes

def home(request):
    recipes = Recipe.objects.order_by('-id')[:3]
    def recipe_to_dict(recipe):
        return {
            'id': recipe.id,
            'name': recipe.title,
            'image': recipe.image.url if recipe.image else '',
        }
    import json
    recipes_json = [recipe_to_dict(r) for r in recipes]
    return render(request, "Home.html", {
        'recipes_json': json.dumps(recipes_json),
    })
