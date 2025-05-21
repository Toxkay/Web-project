from django.shortcuts import redirect, render, get_object_or_404
from django.http import HttpResponse, JsonResponse, Http404
from recipes.models import Recipe
from django.db.models import Q
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User


def admin_dashboard(request):
    recipes = Recipe.objects.all()
    return render(request, 'admin-dashboard.html', {'recipes': recipes})

def delete_recipe(request, recipe_id):
    if request.method == 'POST':
        try:
            recipe = Recipe.objects.get(pk=recipe_id)
            recipe.delete()
            # Render dashboard with deleted message
            recipes = Recipe.objects.all()
            return render(request, 'admin-dashboard.html', {'recipes': recipes, 'deleted': True})
        except Recipe.DoesNotExist:
            return HttpResponse('Recipe not found', status=404)
    return HttpResponse('Invalid request', status=400)

def add_recipe(request):
    if request.method == 'POST':
        title = request.POST.get('recipe_name')
        course = request.POST.get('course')
        ingredients = request.POST.get('ingredients')
        description = request.POST.get('description')
        duration = request.POST.get('duration')
        materials = request.POST.get('materials')
        instructions = request.POST.get('instructions')
        tips = request.POST.get('tips')
        image = request.FILES.get('image')
        try:
            duration = int(duration)
        except (ValueError, TypeError):
            duration = 0
        recipe = Recipe(
            title=title,
            course=course,
            ingredients=ingredients,
            description=description,
            duration=duration,
            materials=materials,
            instructions=instructions,
            tips=tips,
            image=image
        )
        recipe.save()
        # Render dashboard with success message
        recipes = Recipe.objects.all()
        return render(request, 'admin-dashboard.html', {'recipes': recipes, 'success': True})
    return HttpResponse("Invalid request", status=400)

def edit_recipe(request, recipe_id):
    recipe = get_object_or_404(Recipe, pk=recipe_id)
    if request.method == 'POST':
        recipe.title = request.POST.get('recipe_name')
        recipe.course = request.POST.get('course')
        recipe.ingredients = request.POST.get('ingredients')
        recipe.description = request.POST.get('description')
        recipe.duration = request.POST.get('duration')
        recipe.materials = request.POST.get('materials')
        recipe.instructions = request.POST.get('instructions')
        recipe.tips = request.POST.get('tips')
        if request.FILES.get('image'):
            recipe.image = request.FILES.get('image')
        try:
            recipe.duration = int(recipe.duration)
        except (ValueError, TypeError):
            recipe.duration = 0
        recipe.save()
        return redirect('admin_dashboard')
    return render(request, 'edit-recipe.html', {'recipe': recipe})
