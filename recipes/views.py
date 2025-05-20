from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.db.models import Q
from .models import Recipe

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
    return HttpResponse('Invalid request', status=400)

def search(request):
    query = request.GET.get('query', '')
    if query:
        recipes = Recipe.objects.filter(
            Q(title__icontains=query) | Q(ingredients__icontains=query)
        )
    else:
        recipes = Recipe.objects.all()
    for recipe in recipes:
        if isinstance(recipe.ingredients, str):
            recipe.ingredients = [i.strip() for i in recipe.ingredients.split(',') if i.strip()]
    return render(request, "search.html", {'recipes': recipes, 'query': query})

def recipes(request):
    recipes = Recipe.objects.all()
    return render(request, "recipes.html", {"recipes": recipes})

def recipe_detail_api(request, recipe_id):
    try:
        recipe = Recipe.objects.get(pk=recipe_id)
    except Recipe.DoesNotExist:
        return JsonResponse({'error': 'Recipe not found'}, status=404)
    def parse_list_field(field):
        if not field:
            return []
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
    recipe = get_object_or_404(Recipe, pk=recipe_id)
    return render(request, 'recipe-details.html', {'recipe': recipe})

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
