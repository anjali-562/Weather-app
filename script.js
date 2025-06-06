const apiKey = '4a2de68d5561067fe03f21f4440e9707'; // Replace with your actual OpenWeatherMap API key

async function getWeather() {
  const city = document.getElementById('cityInput').value.trim();

  if (city === '') {
    alert("Please enter a city name.");
    return;
  }

  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  try {
    // Fetch current weather
    const currentRes = await fetch(currentUrl);
    if (!currentRes.ok) throw new Error("Current weather fetch failed");
    const currentData = await currentRes.json();

    document.getElementById("currentWeather").innerHTML = `
      <h3>${currentData.name}</h3>
      <p><strong>${currentData.weather[0].main}</strong> - ${currentData.weather[0].description}</p>
      <p>🌡️ Temp: ${currentData.main.temp} °C</p>
      <p>💨 Wind: ${currentData.wind.speed} m/s</p>
      <img src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" />
    `;

    // Fetch forecast
    const forecastRes = await fetch(forecastUrl);
    if (!forecastRes.ok) throw new Error("Forecast fetch failed");
    const forecastData = await forecastRes.json();

    const labels = [];
    const temps = [];

    forecastData.list.forEach(item => {
      if (item.dt_txt.includes("12:00:00")) {
        labels.push(item.dt_txt.split(" ")[0]); // Date only
        temps.push(item.main.temp);
      }
    });

    drawChart(labels, temps);
  } catch (error) {
    alert("City not found or API error.");
    console.error("Error details:", error);
  }
}

function drawChart(labels, temps) {
  const ctx = document.getElementById('forecastChart').getContext('2d');

  // Clear previous chart if any
  if (window.weatherChart) {
    window.weatherChart.destroy();
  }

  window.weatherChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: '5-Day Temperature Forecast (°C)',
        data: temps,
        borderColor: 'blue',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(0,0,255,0.1)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}
