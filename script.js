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
      const iconCode = data.weather[0].icon; // Retrieve the icon code
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Construct icon URL
      document.getElementById('weatherIcon').src = iconUrl; // Set the image source
      document.getElementById('weatherIcon').alt = data.weather[0].description; // Set descriptive alt text
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

      // Loop through the forecast data (every 8th entry is approximately 24 hours apart)
      for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        
        // Extract the icon code and weather description
        const iconCode = day.weather[0].icon; 
        const weatherDescription = day.weather[0].description;
        
        // Construct the icon URL using the icon code
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        
        // Create forecast display for the day
        const forecastDiv = document.createElement('div');
        forecastDiv.classList.add('forecast-day');
        forecastDiv.innerHTML = `
          <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
          <img src="${iconUrl}" alt="${weatherDescription}" class="forecast-icon">
          <p>${weatherDescription}</p>
          <p>Temp: ${day.main.temp}°C</p>
        `;
        forecastContainer.appendChild(forecastDiv);
      }
    })
    .catch(error => {
      console.error('Error fetching forecast:', error);
      alert('Unable to fetch forecast data. Please try again.');
    });
}
