from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.db import IntegrityError
from django.urls import reverse
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views.decorators.http import require_POST
from .models import User, Task, Category
import json
import logging
import random

logger = logging.getLogger(__name__)
# Create your views here.


def index(request):
    welcome_words = ["Hola", "Howdy", "Greetings", "Hey there", "Yo",
                     "Wassup", "Ciao", "Hellooo", "Heeeeeey", "Oi", "Morning", ]
    welcome_word = random.choice(welcome_words)
    if request.user.is_authenticated:
        upcoming_tasks = Task.objects.filter(
            user=request.user).order_by("completed", "due_date")
    else:
        upcoming_tasks = None

    return render(request, "tasks/index.html", {
        "upcoming_tasks": upcoming_tasks,
        "welcome_word": welcome_word
    })


def auth_view(request):
    if request.method == "POST":
        form_type = request.POST.get("form_type")

        if form_type == "login":
            username = request.POST.get("username")
            password = request.POST.get("password")
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                print(f"User {user.username} is now logged in.")
                return HttpResponseRedirect(reverse("index"))
            else:
                return render(request, "tasks/register_login.html", {
                    "message": "Invalid username and/or password.",
                    "form_type": "login"
                })

        elif form_type == "register":
            username = request.POST.get("username")
            email = request.POST.get("email")
            password = request.POST.get("password")
            confirmation = request.POST.get("confirmation")
            first_name = request.POST.get("first_name")
            last_name = request.POST.get("last_name")

            if password != confirmation:
                return render(request, "tasks/register_login.html", {
                    "message": "Passwords must match.",
                    "form_type": "register"
                })

            try:
                user = User.objects.create_user(
                    username=username, email=email, password=password)
                user.first_name = first_name
                user.last_name = last_name
                user.save()
                print(f"User {username} created successfully.")
            except IntegrityError:
                return render(request, "tasks/register_login.html", {
                    "message": "Username already taken.",
                    "form_type": "register"
                })
            except Exception as e:
                print(f"Error creating user: {e}")
                return render(request, "tasks/register_login.html", {
                    "message": "An error occurred during registration.",
                    "form_type": "register"
                })

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                print(f"User {user.username} is now logged in.")
            else:
                print("Authentication failed after registration.")

            return HttpResponseRedirect(reverse("index"))
    else:
        form_type = request.GET.get("form_type", "login")
        return render(request, "tasks/register_login.html", {
            "form_type": form_type
        })


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def task_list(request):
    tasks = Task.objects.filter(user=request.user)
    return render(request, "tasks/task_list.html", {"tasks": tasks})


@login_required
def create_task(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            tasks = data.get("tasks", [])

            user = request.user

            for task_data in tasks:
                title = task_data.get("title")
                description = task_data.get("description")
                due_date = task_data.get("due_date")
                priority = task_data.get("priority")
                category_id = task_data.get("category_id")

                category = None
                if category_id:
                    try:
                        category = Category.objects.get(id=category_id)
                    except Category.DoesNotExist:
                        return JsonResponse({"error": f"Category with ID {category_id} does not exist."}, status=400)

                Task.objects.create(
                    title=title,
                    description=description,
                    due_date=due_date,
                    priority=priority,
                    category=category,
                    user=user
                )

            return JsonResponse({"message": "Tasks created successfully."}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request method."}, status=405)


@require_POST
def toggle_completed(request, task_id):
    try:
        task = Task.objects.get(id=task_id, user=request.user)
        data = json.loads(request.body)
        task.completed = data.get("completed", False)
        task.save()
        return JsonResponse({"message": "Task completion status updated."}, status=200)
    except Task.DoesNotExist:
        return JsonResponse({"error": "Task not found."}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


def delete_task(request, task_id):
    if request.method == "POST":
        task = get_object_or_404(Task, id=task_id)
        task.delete()
        return JsonResponse({"status": "success"})
    return JsonResponse({"status": "error"}, status=400)


@login_required
def get_categories(request):
    categories = list(Category.objects.filter(
        user=request.user).values("id", "name"))
    return JsonResponse({"categories": categories})


def edit_task(request, task_id):
    if request.method == "POST":
        task = get_object_or_404(Task, id=task_id)
        data = json.loads(request.body)
        task.title = data.get("title", task.title)
        task.description = data.get("description", task.description)
        task.due_date = data.get("due_date", task.due_date)
        task.priority = data.get("priority", task.priority)
        new_category_name = data.get("category")

        if new_category_name:

            try:
                new_category = Category.objects.get(
                    name=new_category_name, user=request.user)
                task.category = new_category
            except Category.DoesNotExist:
                return JsonResponse({"status": "error", "message": "Category does not exist."}, status=400)

        task.save()
        return JsonResponse({"status": "success"})

    return JsonResponse({"status": "error"}, status=400)


@login_required
def categories(request):
    if request.user.is_authenticated:
        categories = Category.objects.filter(
            user=request.user).order_by("name")
        categories_list = [category.name for category in list(categories)]
        dictionary = {}
        for category in categories_list:
            initial = category[0].upper()
            if initial in dictionary:
                dictionary[initial].append(category)
            else:
                dictionary[initial] = [category]
        category_data = []

        for category in categories:
            tasks = Task.objects.filter(
                category=category, user=request.user).order_by("completed", "due_date")
            category_data.append({
                "category": category,
                "tasks": tasks
            })
    else:
        category_data = []

    return render(request, "tasks/categories.html", {
        "category_data": category_data,
        "dictionary": dictionary
    })


@login_required
def create_category(request):
    if request.method == "POST":
        categories = list(Category.objects.filter(
            user=request.user).values_list('name', flat=True))
        categories = [category.lower() for category in categories]
        name = request.POST.get("name")
        message = ""
        if not name:
            message = "Category can't be empty"
            return render(request, "tasks/create_category.html", {
                "message": message
            })
        if name.lower() in categories:
            message = "Category already exists"
            return render(request, "tasks/create_category.html", {
                "message": message
            })
        category = Category(
            user=request.user,
            name=name
        )
        category.save()
        return redirect("categories")
    return render(request, "tasks/create_category.html")


@login_required
def search_categories(request):
    query = request.GET.get('q', '')
    results = []
    if query:
        categories = Category.objects.filter(
            user=request.user).order_by("name")
        categories_list = [category.name for category in list(categories)]
        for category in categories_list:
            if query.lower() in category.lower():
                results.append(category)
        category_data = []

        for category in categories:
            tasks = Task.objects.filter(
                category=category, user=request.user).order_by("completed", "due_date")
            category_data.append({
                "category": category,
                "tasks": tasks
            })
        return render(request, "tasks/search_categories.html", {
            "query": query,
            "results": results,
            "category_data": category_data
        })
    else:
        return render(request, "tasks/search_categories.html", {
            "query": query,
            "results": results
        })
