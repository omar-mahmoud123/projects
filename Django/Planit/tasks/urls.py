from django.urls import path
from . import views
urlpatterns = [
    path("", views.index, name="index"),
    path("auth", views.auth_view, name="auth"),
    path("logout", views.logout_view, name="logout"),
    path("create_task", views.create_task, name="create_task"),
    path("task/<int:task_id>/toggle_completed/",
         views.toggle_completed, name="toggle_completed"),
    path("delete_task/<int:task_id>/", views.delete_task, name="delete_task"),
    path("edit_task/<int:task_id>/", views.edit_task, name="edit_task"),
    path("get_categories/", views.get_categories, name="get_categories"),
    path("categories", views.categories, name="categories"),
    path("create_category", views.create_category, name="create_category"),
    path("search_categories", views.search_categories, name="search_categories"),

]
