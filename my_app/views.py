from idlelib.rpc import request_queue

from django.shortcuts import redirect, render
from django.http import HttpResponse, JsonResponse, Http404
from django.shortcuts import render
from .models import Recipe
from django.db.models import Q
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User

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
    # Always pass ingredients as a list for template rendering
    for recipe in recipes:
        if isinstance(recipe.ingredients, str):
            recipe.ingredients = [i.strip() for i in recipe.ingredients.split(',') if i.strip()]
    return render(request, "search.html", {'recipes': recipes, 'query': query})

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        # Override password help texts to plain text
        form.fields['password1'].help_text = "Password must be at least 8 characters and not entirely numeric."
        form.fields['password2'].help_text = "Enter the same password as before, for verification."
        # Set placeholders for each field
        form.fields['username'].widget.attrs['placeholder'] = 'Username'
        form.fields['password1'].widget.attrs['placeholder'] = 'Password'
        form.fields['password2'].widget.attrs['placeholder'] = 'Confirm Password'
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = UserCreationForm()
        form.fields['password1'].help_text = "Password must be at least 8 characters and not entirely numeric."
        form.fields['password2'].help_text = "Enter the same password as before, for verification."
        # Set placeholders for each field
        form.fields['username'].widget.attrs['placeholder'] = 'Username'
        form.fields['password1'].widget.attrs['placeholder'] = 'Password'
        form.fields['password2'].widget.attrs['placeholder'] = 'Confirm Password'
    return render(request, 'signup.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
    else:
        form = AuthenticationForm()
        # Set placeholders for each field
        form.fields['username'].widget.attrs['placeholder'] = 'Username'
        form.fields['password'].widget.attrs['placeholder'] = 'Password'
    return render(request, 'login.html', {'form': form})

def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return redirect('home')

def recipes(request):
    return render(request, "recipes.html")

def about(request):
    return render(request, "About.html")

def favorites(request):
    # You can pass the user's favorite recipes here if you have user logic
    return render(request, "favorites.html")

def recipe_detail_api(request, recipe_id):
    try:
        recipe = Recipe.objects.get(pk=recipe_id)
    except Recipe.DoesNotExist:
        return JsonResponse({'error': 'Recipe not found'}, status=404)

    # Parse ingredients, materials, instructions, tips as lists
    def parse_list_field(field):
        if not field:
            return []
        # Try splitting by newlines, then commas
        if '\n' in field:
            return [item.strip() for item in field.split('\n') if item.strip()]
        return [item.strip() for item in field.split(',') if item.strip()]

    data = {
        'id': recipe.id,
        'name': recipe.title,
        'course': recipe.course,
        'description': recipe.description,
        'duration': f"{recipe.duration} min" if recipe.duration else "",
        'image': recipe.image.url if recipe.image else '',
        'ingredients': parse_list_field(recipe.ingredients),
        'materials': parse_list_field(recipe.materials),
        'instructions': parse_list_field(recipe.instructions),
        'tips': parse_list_field(recipe.tips),
    }
    return JsonResponse(data)

def recipe_details_page(request, recipe_id):
    return render(request, 'recipe-details.html', {'recipe_id': recipe_id})

def recipe_list_api(request):
    recipes = Recipe.objects.all()
    def parse_list_field(field):
        if not field:
            return []
        if '\n' in field:
            return [item.strip() for item in field.split('\n') if item.strip()]
        return [item.strip() for item in field.split(',') if item.strip()]
    data = [
        {
            'id': recipe.id,
            'name': recipe.title,
            'course': recipe.course,
            'description': recipe.description,
            'duration': f"{recipe.duration} min" if recipe.duration else "",
            'image': recipe.image.url if recipe.image else '',
            'ingredients': parse_list_field(recipe.ingredients),
            'materials': parse_list_field(recipe.materials),
            'instructions': parse_list_field(recipe.instructions),
            'tips': parse_list_field(recipe.tips),
        }
        for recipe in recipes
    ]
    return JsonResponse({'recipes': data})



