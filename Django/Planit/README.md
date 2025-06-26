# PLANIT: Task Management System

## Video Demo

Check out the video demo of **PlanIt**: [Watch the Demo](https://youtu.be/ZgkZBHKF1K0)

## Table of Contents

- [Project Overview](#project-overview)
- [File information](#file-information)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation and Setup](#installation-and-setup)

---

## Project Overview

**PlanIt** is a simple yet powerful task management system designed to help users efficiently plan, organize, and manage their tasks. With features like task categories, priorities, inline task editing, and task filtering, PlanIt provides users with the tools they need to stay productive and on top of their tasks.

---

## File Information

### `tasks/`

- Main Django application directory.

### `tasks/models.py`

- **User**: Custom user model extending `AbstractUser`, creating default categories upon user creation.
- **Category**: Represents task categories with a foreign key relationship to the `User` model.
- **Task**: Represents user-created tasks with fields for title, description, priority, due date, completion status, and an optional category.

### `tasks/views.py`

Handles various views for task and category management:

- **index**: Renders the homepage with a welcome message and upcoming tasks.
- **auth_view**: Manages user authentication for login and registration.
- **logout_view**: Logs out users and redirects to the homepage.
- **task_list**: Displays all tasks for the authenticated user.
- **create_task**: Creates new tasks from POST requests.
- **toggle_completed**: Updates task completion status.
- **delete_task**: Deletes a specified task.
- **get_categories**: Returns user-associated categories as JSON.
- **edit_task**: Updates existing task details.
- **categories**: Renders a page with all user categories and tasks.
- **create_category**: Handles category creation.
- **search_categories**: Searches for categories and returns results.

### `tasks/static/planit.js`

- **`convertToValidDate(dateStr)`**: Cleans and converts a date string to a JavaScript Date object; returns `null` if invalid.
- **`getCurrentDate()`**: Retrieves and formats the current date to ISO 8601 (YYYY-MM-DDTHH:mm).
- **`formatDateString(dateString)`**: Converts a date string to ISO 8601 format; returns an empty string for invalid input.
- **`switchForm(form)`**: Toggles between login and registration forms.
- **`toggleSidebar()`**: Toggles the visibility of the sidebar.
- **`collapseSidebar()`**: Collapses the sidebar for viewports less than 964 pixels.
- **`getCookie(name)`**: Retrieves the value of a specified cookie; returns `null` if not found.
- **`deleteTask()`**: Sends a POST request to delete a task and removes the corresponding DOM row.
- **`cancelSavingTasks()`**: Reloads the current page to cancel ongoing task-saving.
- **`toggleTaskCompletion(event)`**: Updates task completion status via a POST request; reloads the page upon success.
- **`saveTasks()`**: Collects task data from the table and sends it to the server; reloads the page upon success.
- **`createTask()`**: Fetches categories and adds a new task row with input fields; displays save and cancel buttons.
- **`editTask()`**: Enables inline editing of a task, replacing information with input fields and saving updates via POST.
- **`sortTableByColumn(table, column, asc = true)`**: Sorts a table column in ascending or descending order; handles dates and priority levels.
- **Event Listener Setup**: Initializes event listeners for sorting, creating, saving tasks, and toggling completion.

### `tasks/templates/`

- **layout.html**: Main structure with a responsive sidebar for navigation.
- **register_login.html**: Dual-purpose interface for user login and registration.
- **index.html**: Displays personalized welcome messages and upcoming tasks.
- **categories.html**: Categorized task list with creation and editing options.
- **search_categories.html**: Displays search results for categories with associated tasks.
- **create_category.html**: Form for creating new categories.

### `tasks/urls.py`

Defines URL patterns for the application:

- Homepage, authentication, task management, and category management routes.
- Each URL pattern links to specific views in `views.py`, facilitating organized routing.

---

## Features

- **Task Priorities:** Assign priorities to tasks (e.g., High, Medium, Low).
- **Categories:** Categorize tasks for better organization.
- **Inline Task Editing:** Modify tasks directly from the task list.
- **Task Completion Toggle:** Mark tasks as complete or incomplete with a single click.
- **Task Sorting:** Sort tasks based on title, priority, or due date.
- **Mobile Responsiveness:** The layout adjusts dynamically to fit different screen sizes.

---

## Tech Stack

- **Frontend:** HTML, CSS (Bootstrap), JavaScript
- **Backend:** Django (Python)
- **Database:** SQLite

---

## Installation and Setup

1. Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```

2. Apply migrations:

    ```bash
    python manage.py makemigrations

    ```

    ```bash
    python manage.py migrate
    ```

3. Create a superuser (optional, for admin access):

    ```bash
    python manage.py createsuperuser
    ```

4. Run the server:

    ```bash
    python manage.py runserver
    ```

---
