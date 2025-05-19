from django.shortcuts import render, redirect
from django.http import HttpResponse
from recipes.models import Recipe

def admin_dashboard(request):
    recipes = Recipe.objects.all()
    return render(request, 'admin-dashboard.html', {'recipes': recipes})

def delete_recipe(request, recipe_id):
    if request.method == 'POST':
        try:
            recipe = Recipe.objects.get(pk=recipe_id)
            recipe.delete()
            return redirect('admin_dashboard')
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
        return redirect('admin_dashboard')
    return HttpResponse('Invalid request', status=400)
