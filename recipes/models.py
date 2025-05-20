from django.db import models

# Create your models here.

class Recipe(models.Model):
    COURSE_CHOICES = [
        ('appetizers', 'Appetizers'),
        ('main course', 'Main Course'),
        ('dessert', 'Dessert'),
    ]

    title = models.CharField(max_length=200)
    course = models.CharField(max_length=20, choices=COURSE_CHOICES)
    ingredients = models.TextField()
    description = models.TextField()
    duration = models.PositiveIntegerField(help_text="Duration in minutes")
    image = models.ImageField(upload_to='recipe_images/', blank=True, null=True)
    materials = models.TextField(blank=True, help_text="Comma-separated list")
    instructions = models.TextField(blank=True)
    tips = models.TextField(blank=True)

    def __str__(self):
        return self.title