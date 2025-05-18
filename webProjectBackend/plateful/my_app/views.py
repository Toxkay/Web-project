from idlelib.rpc import request_queue

from django.shortcuts import redirect, render
from django.http import HttpResponse
from django.shortcuts import render
from .models import Recipe
from django.db.models import Q

def home(request):
    return render(request, "home.html")

def admin_dashboard(request):
    recipes = Recipe.objects.all()
    return render(request, 'admin-dashboard.html', {'recipes': recipes})

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

        # Convert duration to int safely
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

    return HttpResponse("Recipe Added Successfuly!!")

def search(request):
    query = request.GET.get('query', '')
    recipes = Recipe.objects.filter(
        Q(title__icontains=query) | Q(ingredients__icontains=query)
    ) if query else Recipe.objects.none()
    return render(request, "search.html", {'recipes': recipes, 'query': query})