const weatherForm = document.querySelector(".searchContainer");
const cityInput = document.querySelector(".inputCity");
const card = document.querySelector(".resultCard");
const apiKey = "163f57b28955ea4a00013d99257b6672";
weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = cityInput.value;
    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError(error);
        }
    } else {
        displayError("Please enter a city");
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error("Couldn't fetch weather data");
    }
    return await response.json();
}
function displayWeatherInfo(data) {
    const {
        name: city,
        main: { temp, humidity },
        weather: [{ description, id }],
    } = data;
    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("p");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    cityDisplay.classList.add("p");
    cityDisplay.classList.add("cityName");
    card.appendChild(cityDisplay);

    tempDisplay.textContent = `${Math.round(fromKToC(temp))}°C`;
    tempDisplay.classList.add("p");
    tempDisplay.classList.add("tempreture");
    card.appendChild(tempDisplay);

    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    humidityDisplay.classList.add("p");
    card.appendChild(humidityDisplay);

    descDisplay.textContent = description;
    descDisplay.classList.add("p");
    card.appendChild(descDisplay);

    weatherEmoji.textContent = getWeatherEmoji(id);
    weatherEmoji.classList.add("p");
    weatherEmoji.classList.add("weatherEmoji");
    card.appendChild(weatherEmoji);
}
function getWeatherEmoji(weatherId) {
    switch (true) {
        case weatherId > 800:
            return "☁️";
        case weatherId === 800:
            return "☀️";
        case weatherId >= 700:
            return "🌫️";
        case weatherId >= 600:
            return "❄️";
        case weatherId >= 500:
            return "🌧️";
        case weatherId >= 300:
            return "💧";
        case weatherId >= 200:
            return "⛈️";
        default:
            return "❓";
    }
}
function displayError(message) {
    const displayError = document.createElement("p");
    displayError.textContent = message;
    displayError.classList.add("p");
    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(displayError);
}
function fromKToC(temp) {
    return temp - 273.15;
}
