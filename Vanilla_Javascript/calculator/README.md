# 🧮 Calculator App

A simple, responsive calculator built using HTML, CSS, and JavaScript. It supports basic arithmetic operations and is styled to resemble a physical calculator interface.

---

## 🚀 Features

- Responsive design with modern styling
- Basic operations: addition, subtraction, multiplication, division
- Handles decimal input
- Displays calculation errors (e.g., division by zero)

---

## 🖼️ Screenshot

![Calculator Screenshot](/Vanilla_Javascript/calculator/Calculator%20App.png)

---

## 🧪 Technologies Used

- HTML5
- CSS3 (custom styling with hover/active effects)
- Vanilla JavaScript (no libraries or frameworks)

---

## ⚙️ How It Works

- Buttons trigger functions via `onclick` handlers.
- The display is updated dynamically using JavaScript.
- `eval()` is used for expression evaluation after replacing visual symbols (`×`, `÷`) with their JavaScript equivalents (`*`, `/`).
- Errors (like invalid input or division by zero) show `"ERROR"` in the display.

---

## 📂 Folder Structure

calculator/
│
├── index.html       # Main HTML structure
├── style.css        # Custom styling for calculator UI
├── index.js         # Calculator logic and interaction handling
├── favicon.png      # Page icon
└── README.md        # Project documentation
