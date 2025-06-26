from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.


class User(AbstractUser):
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        create_default_categories(self)


class Category(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="Category")
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


def create_default_categories(user):
    Category.objects.get_or_create(user=user, name="None")


class Task(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    priority = models.CharField(
        max_length=10, choices=PRIORITY_CHOICES, default='Low')
    due_date = models.DateTimeField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE,
                                 related_name="tasks", null=True, blank=True)

    def __str__(self):
        return self.title
