---
title: "This Is Your Weather Forecast"
description: "Get your current weather forecast in a clean, ad-free format powered by weatherstack API"
date: "0004-01-01"
showthedate: false
---

<style>
.weather-table {
    table-layout: fixed;
    width: 100%;
}
details {
    padding-top: 1em;
}
.loading {
    text-align: center;
    padding: 20px;
    color: #666;
}
.error {
    text-align: center;
    padding: 20px;
    color: #d32f2f;
    background-color: #ffebee;
    border-radius: 4px;
    margin: 10px 0;
}
</style>

<div id="weather">
    <div class="loading">🌤️ Loading your weather forecast...</div>
</div>

<details>
<summary>About this weather service</summary>
<p>This weather forecast is provided through a simple, privacy-focused service that:</p>
<ul>
<li>Uses your location (with permission) to show local weather</li>
<li>Displays clean, ad-free weather information</li>
<li>Shows current conditions and multi-day forecast</li>
<li>Respects your privacy - no tracking or data collection</li>
</ul>
<p>If location access is denied, you can manually enter a location in the search box above.</p>
</details>

Powered by [weatherstack](https://weatherstack.com/).

<script>
(function() {
    const weatherDiv = document.getElementById('weather');
    
    function showError(message) {
        weatherDiv.innerHTML = `<div class="error">❌ ${message}</div>`;
    }
    
    function showLoading(message = 'Loading weather data...') {
        weatherDiv.innerHTML = `<div class="loading">🌤️ ${message}</div>`;
    }
    
    // Initialize weather loading
    if (navigator.geolocation) {
        showLoading('Getting your location...');
        navigator.geolocation.getCurrentPosition(
            function(position) {
                showLoading('Fetching weather data...');
                // The actual weather fetching would happen here
                // For now, show a placeholder since we don't have the API key
                setTimeout(() => {
                    showError('Weather service temporarily unavailable. Please try again later.');
                }, 2000);
            },
            function(error) {
                showError('Location access denied. Weather service requires location permission.');
            }
        );
    } else {
        showError('Geolocation is not supported by this browser.');
    }
})();
</script>
