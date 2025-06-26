function convertToValidDate(dateStr) {
    let cleanedDateStr = dateStr.replace(/([ap])\.m\./i, "$1m");

    const validDate = new Date(cleanedDateStr);

    if (isNaN(validDate)) {
        console.error("Invalid date format:", cleanedDateStr);
        return null;
    }

    return validDate;
}
function getCurrentDate() {
    const date = new Date();
    const offset = date.getTimezoneOffset();

    const localDate = new Date(date.getTime() - offset * 60 * 1000);

    const formattedDate = localDate.toISOString().slice(0, 16);

    return formattedDate;
}
function formatDateString(dateString) {
    const regex = /(\w+) (\d+), (\d+), (\d+):(\d+) (a\.m\.|p\.m\.)/;
    const match = dateString.match(regex);

    if (!match) {
        console.error("Invalid date string:", dateString);
        return "";
    }

    const monthNames = {
        January: "01",
        February: "02",
        March: "03",
        April: "04",
        May: "05",
        June: "06",
        July: "07",
        August: "08",
        September: "09",
        October: "10",
        November: "11",
        December: "12",
    };

    const month = monthNames[match[1]];
    const day = String(match[2]).padStart(2, "0");
    const year = match[3];
    let hours = parseInt(match[4], 10);
    const minutes = String(match[5]).padStart(2, "0");
    const ampm = match[6];

    if (ampm === "p.m." && hours < 12) {
        hours += 12;
    }
    if (ampm === "a.m." && hours === 12) {
        hours = 0;
    }
    hours = String(hours).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    return formattedDate;
}
function switchForm(form) {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const loginTab = document.getElementById("login-tab");
    const registerTab = document.getElementById("register-tab");

    loginForm.style.display = "none";
    registerForm.style.display = "none";
    loginTab.classList.remove("active");
    registerTab.classList.remove("active");

    if (form === "login") {
        loginForm.style.display = "block";
        loginTab.classList.add("active");
    } else {
        registerForm.style.display = "block";
        registerTab.classList.add("active");
    }
}
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const body = document.body;

    sidebar.classList.toggle("collapsed");
    body.classList.toggle("sidebar-collapsed");
}
function collapseSidebar() {
    const pageWidth = window.innerWidth;
    const sidebar = document.getElementById("sidebar");
    const body = document.body;
    if (pageWidth < 964) {
        sidebar.classList.add("collapsed");
        body.classList.add("sidebar-collapsed");
    }
}
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(`${name}=`)) {
                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                );
                break;
            }
        }
    }
    return cookieValue;
}
function deleteTask() {
    const taskId = this.getAttribute("data-task-id");

    fetch(`/delete_task/${taskId}/`, {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie("csrftoken"),
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "success") {
                this.closest("tr").remove();
            } else {
                console.error("Failed to delete task");
            }
        })
        .catch((error) => console.error("Error:", error));
}
function cancelSavingTasks() {
    window.location.reload();
}
function toggleTaskCompletion(event) {
    if (event.target.name === "completed") {
        const taskId = event.target.getAttribute("data-task-id");
        const isCompleted = event.target.checked;

        fetch(`/task/${taskId}/toggle_completed/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({ completed: isCompleted }),
        })
            .then((response) => {
                if (response.ok) {
                    window.location.reload();
                } else {
                    console.error("Failed to update task completion status.");
                }
            })
            .catch((error) => {
                console.error("Error occurred while updating task:", error);
            });
    }
}
function saveTasks() {
    const taskTableBodies = document.querySelectorAll(".table-body");
    let taskTableBody;
    if (taskTableBodies.length > 1) {
        taskTableBody = this.closest("li").querySelector("tbody");
    } else {
        taskTableBody = document.getElementById("table-body");
    }
    const rows = taskTableBody.getElementsByTagName("tr");
    const tasksToSave = [];

    for (let row of rows) {
        const taskId = row.getAttribute("data-task-id");
        if (!taskId) {
            const titleInput = row.querySelector("input[name='title']");
            const descriptionInput = row.querySelector(
                "input[name='description']"
            );
            const dueDateInput = row.querySelector("input[name='due_date']");
            const prioritySelect = row.querySelector("select[name='priority']");
            const categorySelect = row.querySelector("select[name='category']");
            if (titleInput && prioritySelect && categorySelect) {
                const title = titleInput.value;
                const description = descriptionInput.value;
                const dueDate = dueDateInput.value || getCurrentDate();
                const priority = prioritySelect.value;
                const category_id = categorySelect.value;

                if (title && dueDate) {
                    tasksToSave.push({
                        title,
                        description,
                        due_date: dueDate,
                        priority,
                        category_id,
                    });
                }
            }
        }
    }

    if (tasksToSave.length > 0) {
        fetch("/create_task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({ tasks: tasksToSave }),
        })
            .then((response) => {
                if (response.ok) {
                    document.getElementById("saveTableBtn").style.display =
                        "none";
                    window.location.reload();
                } else {
                    console.error("Failed to save tasks");
                }
            })
            .catch((error) => {
                console.error("Error occurred while saving tasks:", error);
            });
    }
}
function createTask() {
    const taskTableBody = document.getElementById("table-body");
    const saveTableBtn = document.getElementById("saveTableBtn");
    const cancelTableBtn = document.getElementById("cancelTableBtn");
    const newRow = document.createElement("tr");

    fetch("/get_categories/")
        .then((response) => response.json())
        .then((data) => {
            const categories = data.categories;

            let categoryOptions = "";

            if (categories.length > 0) {
                categories.forEach((category) => {
                    categoryOptions += `<option value="${category.id}">${category.name}</option>`;
                });
            } else {
                categoryOptions = `<option value="" disabled>No categories available</option>`;
            }

            newRow.innerHTML = `
                <td>
                    <button class="icon-button edit-btn">
                        <i class="fa-solid fa-pen-to-square edit-icon" title="Edit Task"></i>
                    </button>
                </td>
                <td><input type="text" name="title" placeholder="Task Title" required class="table-input"></td>
                <td><input type="text" name="description" placeholder="Task Description" required class="table-input"></td>
                <td><input class="table-input" type="datetime-local" name="due_date"></td>
                <td>
                    <select class="table-select" name="priority">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </td>
                <td>
                    <select class="table-select" name="category">
                        ${categoryOptions}
                    </select>
                </td>
                <td>
                    <input type="checkbox" name="completed">
                </td>
                <td>
                    <button class="icon-button">
                        <i class="fa-solid fa-trash delete-icon" title="Delete Task"></i>
                    </button>
                </td>
            `;

            taskTableBody.appendChild(newRow);
            saveTableBtn.style.display = "block";
            cancelTableBtn.style.display = "block";
        })
        .catch((error) => console.error("Error fetching categories:", error));
}
function createTaskCategory() {
    const tableBody = this.closest("li").querySelector("tbody");
    const saveTableBtn = this.closest("li").querySelector(".saveTableBtn");
    const cancelTableBtn = this.closest("li").querySelector(".cancelTableBtn");
    const currentCategory = this.closest("li").querySelector("h3").textContent;
    const newRow = document.createElement("tr");

    fetch("/get_categories/")
        .then((response) => response.json())
        .then((data) => {
            const categories = data.categories;

            let categoryOptions = "";

            if (categories.length > 0) {
                categories.forEach((category) => {
                    categoryOptions += `<option value="${category.id}" ${
                        category.name === currentCategory ? "selected" : ""
                    }>${category.name}</option>`;
                });
            } else {
                categoryOptions = `<option value="" disabled>No categories available</option>`;
            }

            newRow.innerHTML = `
                <td>
                    <button class="icon-button edit-btn">
                        <i class="fa-solid fa-pen-to-square edit-icon" title="Edit Task"></i>
                    </button>
                </td>
                <td><input type="text" name="title" placeholder="Task Title" required class="table-input"></td>
                <td><input type="text" name="description" placeholder="Task Description" required class="table-input"></td>
                <td><input class="table-input" type="datetime-local" name="due_date"></td>
                <td>
                    <select class="table-select" name="priority">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </td>
                <td>
                    <select class="table-select" name="category">
                        ${categoryOptions}
                    </select>
                </td>
                <td>
                    <input type="checkbox" name="completed">
                </td>
                <td>
                    <button class="icon-button">
                        <i class="fa-solid fa-trash delete-icon" title="Delete Task"></i>
                    </button>
                </td>
            `;

            tableBody.appendChild(newRow);
            saveTableBtn.style.display = "block";
            cancelTableBtn.style.display = "block";
        })
        .catch((error) => console.error("Error fetching categories:", error));
}
function editTask() {
    const saveTableBtns = document.querySelectorAll(".saveTableBtn");
    let saveTableBtn;
    let cancelTableBtn;
    if (saveTableBtns.length > 1) {
        saveTableBtn = this.closest("li").querySelector(".saveTableBtn");
        cancelTableBtn = this.closest("li").querySelector(".cancelTableBtn");
    } else {
        saveTableBtn = document.getElementById("saveTableBtn");
        cancelTableBtn = document.getElementById("cancelTableBtn");
    }
    const taskId = this.getAttribute("data-task-id");
    const row = this.closest("tr");

    const title = row.querySelector("td:nth-child(2)").textContent;
    const description = row.querySelector("td:nth-child(3)").textContent;
    const dueDate = row.querySelector("td:nth-child(4)").textContent;
    const priority = row.querySelector("td:nth-child(5)").textContent;
    const category = row.querySelector("td:nth-child(6)").textContent;
    fetch("/get_categories/")
        .then((response) => response.json())
        .then((data) => {
            const categories = data.categories;

            let categoryOptions = "";
            categories.forEach((c) => {
                categoryOptions += `<option value="${c.name}" ${
                    c.name === category ? "selected" : ""
                }>${c.name}</option>`;
            });
            row.querySelector(
                "td:nth-child(2)"
            ).innerHTML = `<input type="text" name="title" placeholder="Task Title" class="table-input" value="${title}" required>`;
            row.querySelector(
                "td:nth-child(3)"
            ).innerHTML = `<input type="text" name="description" placeholder="Task Description" class="table-input" value="${description}">`;
            row.querySelector(
                "td:nth-child(4)"
            ).innerHTML = `<input class="table-input" type="datetime-local" name="due_date" value="${formatDateString(
                dueDate
            )}">`;
            row.querySelector("td:nth-child(5)").innerHTML = `
                <select class="table-select" name="priority">
                    <option value="low" ${
                        priority === "Low" ? "selected" : ""
                    }>Low</option>
                    <option value="medium" ${
                        priority === "Medium" ? "selected" : ""
                    }>Medium</option>
                    <option value="high" ${
                        priority === "High" ? "selected" : ""
                    }>High</option>
                </select>`;
            row.querySelector("td:nth-child(6)").innerHTML = `
                <select class="table-select" name="category">
                    ${categoryOptions}
                </select>`;
        })
        .catch((error) => console.error("Error fetching categories:", error));

    saveTableBtn.style.display = "block";
    cancelTableBtn.style.display = "block";
    saveTableBtn.addEventListener("click", () => {
        const updatedTitle = row.querySelector("td:nth-child(2) input").value;
        const updatedDescription = row.querySelector(
            "td:nth-child(3) input"
        ).value;
        const updatedDuedate = row.querySelector("td:nth-child(4) input").value;
        const updatedpriority = row.querySelector(
            "td:nth-child(5) select"
        ).value;
        const updatedcategory = row.querySelector(
            "td:nth-child(6) select"
        ).value;
        if (updatedTitle) {
            fetch(`/edit_task/${taskId}/`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCookie("csrftoken"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: updatedTitle,
                    description: updatedDescription,
                    due_date: updatedDuedate,
                    priority: updatedpriority,
                    category: updatedcategory,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status === "success") {
                        saveTableBtn.remove();
                        cancelTableBtn.remove();
                        window.location.reload();
                    } else {
                        console.error("Failed to update task");
                    }
                })
                .catch((error) => console.error("Error:", error));
        }
    });
}
function sortTableByColumn(table, column, asc = true) {
    includedCols = [1, 2, 3, 4, 5];
    if (includedCols.includes(column)) {
        const dirModifier = asc ? 1 : -1;
        const tBody = table.tBodies[0];
        const rows = Array.from(tBody.querySelectorAll("tr"));
        const priorityOrder = {
            High: 3,
            Medium: 2,
            Low: 1,
        };
        const sortedRows = rows.sort((a, b) => {
            const aColText = a
                .querySelector(`td:nth-child(${column + 1})`)
                .textContent.trim();
            const bColText = b
                .querySelector(`td:nth-child(${column + 1})`)
                .textContent.trim();
            if (column === 0 || column === 6 || column === 7) {
                return null;
            }
            if (column === 3) {
                const aDate = new Date(convertToValidDate(aColText));
                const bDate = new Date(convertToValidDate(bColText));

                return (aDate - bDate) * dirModifier;
            } else if (column === 4) {
                const aPriority = priorityOrder[aColText] || 0;
                const bPriority = priorityOrder[bColText] || 0;

                return (aPriority - bPriority) * dirModifier;
            } else {
                return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
            }
        });
        while (tBody.firstChild) {
            tBody.removeChild(tBody.firstChild);
        }
        tBody.append(...sortedRows);

        table
            .querySelectorAll("th")
            .forEach((th) =>
                th.classList.remove("th-sort-asc", "th-sort-desc")
            );
        table
            .querySelector(`th:nth-child(${column + 1})`)
            .classList.toggle("th-sort-asc", asc);
        table
            .querySelector(`th:nth-child(${column + 1})`)
            .classList.toggle("th-sort-desc", !asc);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".table-sortable th").forEach((headerCell) => {
        headerCell.addEventListener("click", () => {
            const tableElement =
                headerCell.parentElement.parentElement.parentElement;
            const headerIndex = Array.prototype.indexOf.call(
                headerCell.parentElement.children,
                headerCell
            );
            const currentIsAscending =
                headerCell.classList.contains("th-sort-asc");
            sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
        });
    });
    const newTaskBtns = document.querySelectorAll(".newTaskBtn");
    if (newTaskBtns.length == 1) {
        const newTaskBtn = document.getElementById("newTaskBtn");
        newTaskBtn.addEventListener("click", createTask);
    }
    const saveTableBtns = document.querySelectorAll(".saveTableBtn");
    const cancelTableBtns = document.querySelectorAll(".cancelTableBtn");
    const taskTableBody = document.getElementById("table-body");
    const deleteTaskBtns = document.getElementsByClassName("delete-btn");
    const editTaskBtns = document.getElementsByClassName("edit-btn");

    collapseSidebar();
    window.addEventListener("resize", collapseSidebar);
    if (newTaskBtns.length > 1) {
        newTaskBtns.forEach((button) => {
            button.addEventListener("click", createTaskCategory);
        });
    }
    if (saveTableBtns) {
        saveTableBtns.forEach((button) => {
            button.addEventListener("click", saveTasks);
        });
    }
    if (cancelTableBtns) {
        cancelTableBtns.forEach((button) => {
            button.addEventListener("click", cancelSavingTasks);
        });
    }
    if (taskTableBody) {
        taskTableBody.addEventListener("change", toggleTaskCompletion);
    }

    for (let i = 0; i < deleteTaskBtns.length; i++) {
        deleteTaskBtns[i]?.addEventListener("click", deleteTask);
    }
    for (let i = 0; i < editTaskBtns.length; i++) {
        editTaskBtns[i]?.addEventListener("click", editTask);
    }
});
