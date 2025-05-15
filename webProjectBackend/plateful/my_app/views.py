from django.shortcuts import redirect, render
from django.http import HttpResponse
from django.shortcuts import render
from .models import Recipe  

def home(request):
    return render(request, "home.html")

def admin_dashboard(request):
    return render(request , "admin-dashboard.html")

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