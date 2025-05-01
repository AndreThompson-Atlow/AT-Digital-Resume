document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const loadingContainer = document.getElementById('loadingContainer');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    const weatherContainer = document.getElementById('weatherContainer');
    
    // Weather display elements
    const cityName = document.getElementById('cityName');
    const countryName = document.getElementById('countryName');
    const temperature = document.getElementById('temperature');
    const feelsLike = document.getElementById('feelsLike');
    const weatherIcon = document.getElementById('weatherIcon');
    const weatherDescription = document.getElementById('weatherDescription');
    const humidity = document.getElementById('humidity');
    const humidityBar = document.getElementById('humidityBar');
    const windSpeed = document.getElementById('windSpeed');
    const windDirection = document.getElementById('windDirection');
    const pressure = document.getElementById('pressure');
    const pressureStatus = document.getElementById('pressureStatus');
    const visibility = document.getElementById('visibility');
    const visibilityBar = document.getElementById('visibilityBar');
    const forecastGrid = document.getElementById('forecastGrid');
    
    // Time and date display
    const currentTimeEl = document.getElementById('currentTime');
    const currentDateEl = document.getElementById('currentDate');
    
    // Weather icons using Unicode symbols (for simplicity)
    const weatherIcons = {
        'clear': '☀️',
        'clouds': '☁️',
        'drizzle': '🌦️',
        'rain': '🌧️',
        'thunderstorm': '⛈️',
        'snow': '❄️',
        'mist': '🌫️',
        'smoke': '🌫️',
        'haze': '🌫️',
        'dust': '🌫️',
        'fog': '🌫️',
        'sand': '🌫️',
        'ash': '🌫️',
        'squall': '🌬️',
        'tornado': '🌪️'
    };
    
    // Directions for wind
    const directions = ['↑ N', '↗ NE', '→ E', '↘ SE', '↓ S', '↙ SW', '← W', '↖ NW'];
    
    // Initialize clock
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Set up event listeners
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = searchInput.value.trim();
        if (city) {
            searchWeather(city);
        }
    });
    
    // Initial state - hide everything except loading and then quickly show search
    weatherContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');
    
    // For demo purposes, hide loading after a short delay
    setTimeout(() => {
        loadingContainer.classList.add('hidden');
    }, 1000);
    
    // Update time and date
    function updateDateTime() {
        const now = new Date();
        
        // Time with blinking colon
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const blinkColon = now.getSeconds() % 2 === 0 ? ':' : ' ';
        currentTimeEl.textContent = `${hours}${blinkColon}${minutes}${blinkColon}${seconds}`;
        
        // Date
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();
        currentDateEl.textContent = `${day}/${month}/${year}`;
    }
    
    // Search weather (mock data for this demo)
    function searchWeather(city) {
        // Show loading, hide others
        loadingContainer.classList.remove('hidden');
        weatherContainer.classList.add('hidden');
        errorContainer.classList.add('hidden');
        
        // Disable search during "API call"
        searchButton.disabled = true;
        searchInput.disabled = true;
        
        // Add glowing effect to search button
        searchButton.classList.add('searching');
        
        // Simulate API call delay
        setTimeout(() => {
            // Remove searching effects
            searchButton.disabled = false;
            searchInput.disabled = false;
            searchButton.classList.remove('searching');
            
            // Hide loading
            loadingContainer.classList.add('hidden');
            
            // Random success/fail for demo purposes
            const cityLower = city.toLowerCase();
            
            if (cityLower === 'error' || Math.random() < 0.2) {
                // Show error for specific test value or randomly
                showError('Location not found. Try different coordinates.');
                return;
            }
            
            // Mock data based on city name for demo
            const mockData = generateMockData(city);
            
            // Display the weather data
            displayWeatherData(mockData);
        }, 2000); // 2 second delay to simulate API call
    }
    
    // Generate mock data based on city name
    function generateMockData(city) {
        const temp = Math.floor(Math.random() * 35) - 5; // -5 to 30 degrees
        const feelsLikeTemp = temp + (Math.random() * 5 - 2.5); // ±2.5 degrees from actual temp
        
        const weatherTypes = Object.keys(weatherIcons);
        const weatherType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        
        const windSpeedValue = Math.floor(Math.random() * 20); // 0-20 m/s
        const windDirectionValue = Math.floor(Math.random() * 360); // 0-360 degrees
        
        const humidityValue = Math.floor(Math.random() * 100); // 0-100%
        const pressureValue = Math.floor(Math.random() * 50) + 975; // 975-1025 hPa
        const visibilityValue = Math.floor(Math.random() * 10); // 0-10 km
        
        return {
            city: city,
            country: 'Cyberpunk District',
            temperature: temp,
            feelsLike: feelsLikeTemp.toFixed(1),
            weather: {
                type: weatherType,
                description: weatherType.toUpperCase()
            },
            wind: {
                speed: windSpeedValue,
                direction: windDirectionValue
            },
            humidity: humidityValue,
            pressure: pressureValue,
            visibility: visibilityValue,
            forecast: generateMockForecast(temp)
        };
    }
    
    // Generate mock forecast
    function generateMockForecast(baseTemp) {
        const forecast = [];
        const now = new Date();
        
        for (let i = 0; i < 8; i++) {
            const forecastTime = new Date(now.getTime() + (i + 1) * 3 * 60 * 60 * 1000); // Every 3 hours
            const hours = forecastTime.getHours().toString().padStart(2, '0');
            
            const weatherTypes = Object.keys(weatherIcons);
            const weatherType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
            
            const tempVariation = Math.random() * 10 - 5; // -5 to +5 degrees from base temp
            const forecastTemp = Math.round(baseTemp + tempVariation);
            
            forecast.push({
                time: `${hours}:00`,
                icon: weatherType,
                temp: forecastTemp
            });
        }
        
        return forecast;
    }
    
    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorContainer.classList.remove('hidden');
        weatherContainer.classList.add('hidden');
        
        // Add glitch effect to error message
        errorContainer.classList.add('glitch-effect');
        setTimeout(() => {
            errorContainer.classList.remove('glitch-effect');
        }, 1000);
    }
    
    // Display weather data
    function displayWeatherData(data) {
        // Update main weather display
        cityName.textContent = data.city;
        countryName.textContent = data.country;
        temperature.textContent = `${data.temperature}°C`;
        feelsLike.textContent = `${data.feelsLike}°C`;
        
        // Weather icon and description
        weatherIcon.textContent = weatherIcons[data.weather.type] || '🌐';
        weatherDescription.textContent = data.weather.description;
        
        // Weather details
        humidity.textContent = `${data.humidity}%`;
        humidityBar.style.width = `${data.humidity}%`;
        
        windSpeed.textContent = `${data.wind.speed} m/s`;
        
        // Convert degrees to 8-point direction
        const directionIndex = Math.round(data.wind.direction / 45) % 8;
        windDirection.textContent = directions[directionIndex];
        
        pressure.textContent = `${data.pressure} hPa`;
        
        // Set pressure status based on value
        if (data.pressure < 990) {
            pressureStatus.textContent = 'LOW';
            pressureStatus.style.color = 'var(--danger-color)';
        } else if (data.pressure > 1020) {
            pressureStatus.textContent = 'HIGH';
            pressureStatus.style.color = 'var(--accent-color)';
        } else {
            pressureStatus.textContent = 'NORMAL';
            pressureStatus.style.color = 'var(--success-color)';
        }
        
        visibility.textContent = `${data.visibility} km`;
        const visibilityPercent = (data.visibility / 10) * 100; // Assuming 10km is 100%
        visibilityBar.style.width = `${visibilityPercent}%`;
        
        // Generate forecast HTML
        generateForecastHTML(data.forecast);
        
        // Show weather container with animation
        weatherContainer.classList.remove('hidden');
        
        // Add entrance animations
        animateWeatherData();
    }
    
    // Generate forecast HTML
    function generateForecastHTML(forecastData) {
        forecastGrid.innerHTML = '';
        
        forecastData.forEach(item => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            
            forecastItem.innerHTML = `
                <div class="forecast-time">${item.time}</div>
                <div class="forecast-icon">${weatherIcons[item.icon] || '🌐'}</div>
                <div class="forecast-temp">${item.temp}°C</div>
            `;
            
            forecastGrid.appendChild(forecastItem);
        });
    }
    
    // Animate weather data entrance
    function animateWeatherData() {
        // Add animation class to elements
        document.querySelectorAll('.weather-primary, .weather-details, .forecast-container')
            .forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                el.style.transitionDelay = `${index * 0.2}s`;
                
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 50);
            });
        
        // Animate forecast items
        const forecastItems = document.querySelectorAll('.forecast-item');
        forecastItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.transitionDelay = `${0.6 + index * 0.1}s`;
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 50);
        });
    }
    
    // Add CSS for animations and effects
    const style = document.createElement('style');
    style.textContent = `
        .search-bar button.searching {
            animation: searchingPulse 1s infinite;
        }
        
        @keyframes searchingPulse {
            0%, 100% { box-shadow: 0 0 5px rgba(23, 74, 255, 0.4); }
            50% { box-shadow: 0 0 15px rgba(23, 74, 255, 0.7); }
        }
        
        .glitch-effect {
            animation: glitch 0.3s linear;
        }
        
        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-5px, 5px); }
            40% { transform: translate(-5px, -5px); }
            60% { transform: translate(5px, 5px); }
            80% { transform: translate(5px, -5px); }
            100% { transform: translate(0); }
        }
    `;
    document.head.appendChild(style);
}); 