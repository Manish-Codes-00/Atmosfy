const apiKey = 'c5a8947a4c2357205680ee0cad4874f4'; 

document.getElementById('searchButton').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value.trim();
  if (city) {
    fetchWeather(city);
    fetchForecast(city);
  } else {
    alert('Please enter a city name.');
  }
});

function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      // Update weather details
      document.getElementById('cityName').textContent = data.name;
      document.getElementById('temperature').textContent = `🌡️ Temperature: ${data.main.temp}°C`;
      document.getElementById('description').textContent = `🌤 Weather: ${data.weather[0].description}`;
      document.getElementById('humidity').textContent = `💧 Humidity: ${data.main.humidity}%`;
      document.getElementById('windSpeed').textContent = `💨 Wind Speed: ${data.wind.speed} m/s`;

      // Set Weather Icon
      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      document.getElementById('weatherIcon').src = iconUrl;
      document.getElementById('weatherIcon').alt = data.weather[0].description;
    })
    .catch(error => {
      console.error('Error fetching weather:', error);
      alert('Unable to fetch weather data. Please try again.');
    });
}

function fetchForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found for forecast');
      }
      return response.json();
    })
    .then(data => {
      const forecastContainer = document.getElementById('forecastContainer');
      forecastContainer.innerHTML = ''; // Clear previous forecast

      const now = new Date(); // current local time
      const todayKey = now.toLocaleDateString(); // string for "today"

      const dailyForecast = {};

      data.list.forEach(item => {
        const forecastDate = new Date(item.dt * 1000);

        // Skip past times
        if (forecastDate < now) return;

        const dateKey = forecastDate.toLocaleDateString();

        // Pick only one forecast per day (closest to midday)
        if (!dailyForecast[dateKey]) {
          dailyForecast[dateKey] = item;
        }
      });

      // Display each day's forecast
      Object.values(dailyForecast).forEach(day => {
        const iconCode = day.weather[0].icon;
        const weatherDescription = day.weather[0].description;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        const forecastDateKey = new Date(day.dt * 1000).toLocaleDateString();
        const title = (forecastDateKey === todayKey) ? "Today" : forecastDateKey;

        const forecastDiv = document.createElement('div');
        forecastDiv.classList.add('forecast-day');
        forecastDiv.innerHTML = `
          <p>${title}</p>
          <img src="${iconUrl}" alt="${weatherDescription}" class="forecast-icon">
          <p>${weatherDescription}</p>
          <p>Temp: ${day.main.temp}°C</p>
        `;
        forecastContainer.appendChild(forecastDiv);
      });
    })
    .catch(error => {
      console.error('Error fetching forecast:', error);
      alert('Unable to fetch forecast data. Please try again.');
    });
}
