from django.shortcuts import render, HttpResponse
from recipes.models import Recipe

# Create your views here.


def home(request):
    # Fetch top 3 recipes (by id descending, or customize as needed)
    recipes = Recipe.objects.order_by('-id')[:3]
    # Prepare data for JS (handle image path)
    def recipe_to_dict(recipe):
        return {
            'id': recipe.id,
            'name': recipe.title,
            'image': recipe.image.url if recipe.image else '',
        }
    recipes_json = [recipe_to_dict(r) for r in recipes]
    import json
    return render(request, "Home.html", {
        'recipes_json': json.dumps(recipes_json),
    })
