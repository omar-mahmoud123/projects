# 🌦️ Weather App

A simple web app that lets you search for any city and get real-time weather information using the OpenWeatherMap API. The app shows temperature, humidity, description, and a weather emoji.

---

## 🔍 Features

- Search weather by city name
- Real-time weather data from OpenWeatherMap
- Displays:
  - City name
  - Temperature in Celsius
  - Humidity
  - Weather description
  - Weather emoji based on conditions

---

## 🖼️ Screenshot

![Weather App Screenshot](/Vanilla_Javascript/weather_app/Weather%20App%20Screenshot.png)

---

## 🧪 Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- OpenWeatherMap API

---

## ⚙️ Setup Instructions

1. **Clone the repository:**

    ```bash
    git clone https://github.com/omar-mahmoud123/projects.git
    ```

2. **Navigate into the project folder:**

    ```bash
    cd projects/Vanilla_Javascript/weather_app
    ```

3. **Create your own `config.js` file:**

    - Copy the example config file:

      ```bash
      cp config.example.js config.js
      ```

4. **Replace the API key:**

    - Open config.js.
    - Replace "YOUR_API_KEY_HERE" with your actual OpenWeatherMap API key.
    - To get your own OpenWeatherMap API key:
        1. Go to [https://home.openweathermap.org/](https://home.openweathermap.org/)
        2. Sign up for a free account and verify your email
        3. Navigate to [My API keys](https://home.openweathermap.org/api_keys)
        4. Copy your key and paste it into `config.js`

5. **Open the app:**

    - Open `index.html` in your browser directly  
    - Or use a live server (e.g., the Live Server extension in VS Code)

### 🔐 Note

- My API key is **not included** in this repository for security reasons.
- If you're using a **new API key**, it might take a few minutes to become active. If you see a `401 Unauthorized` error, wait a bit and try again.
