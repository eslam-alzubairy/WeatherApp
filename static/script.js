
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherResultBox = document.getElementById('weather-result');
const messageBox = document.getElementById('message-box');

const fetchWeather = async () => {
    const city = cityInput.value.trim();

    if (city === '') {
        showMessage('الرجاء إدخال اسم مدينة.');
        return;
    }

    showMessage('جاري البحث...', true);
    weatherResultBox.classList.add('hidden');

    try {
        const response = await fetch(`/weather?city=${encodeURIComponent(city)}`);

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        displayWeather(data);
        clearMessage();

    } catch (error) {
        console.error('Error:', error);
        showMessage(error.message);
        weatherResultBox.classList.add('hidden');
    }
};

const displayWeather = (data) => {
    const cityName = document.getElementById('city-name');
    const temperature = document.getElementById('temperature');
    const description = document.getElementById('weather-description');
    const icon = document.getElementById('weather-icon');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('wind-speed');

    cityName.textContent = data.city;
    temperature.textContent = data.temperature;
    description.textContent = data.description;
    icon.src = `http://openweathermap.org/img/wn/${data.icon}@2x.png`;
    humidity.textContent = `${data.humidity}%`;
    windSpeed.textContent = `${data.wind_speed} كم/س`;

    weatherResultBox.classList.remove('hidden');
    updateBackground(data.icon);

};

const updateBackground = (iconCode) => {
    const body = document.body;
    let gradientVar = '';
    let imageUrl = '';
    const imageQuality = 'w=1920&q=80'; 

    // اقتران رمز الأيقونة بالخلفية
    if (iconCode.includes('01')) { // Clear
        gradientVar = 'var(--gradient-clear)';
        imageUrl = `https://images.unsplash.com/photo-1590077428593-a55d7525e548?${imageQuality}`;
    } else if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) { // Clouds
        gradientVar = 'var(--gradient-clouds)';
        imageUrl = `https://images.unsplash.com/photo-1534088568595-a066f410bcda?${imageQuality}`;
    } else if (iconCode.includes('09') || iconCode.includes('10')) { // Rain
        gradientVar = 'var(--gradient-rain)';
        imageUrl = `https://images.unsplash.com/photo-1519692933481-e14e246f4d87?${imageQuality}`;
    } else if (iconCode.includes('11')) { // Storm
        gradientVar = 'var(--gradient-storm)';
        imageUrl = `https://images.unsplash.com/photo-1605727226343-9364b9742444?${imageQuality}`;
    } else if (iconCode.includes('13')) { // Snow
        gradientVar = 'var(--gradient-snow)';
        imageUrl = `https://images.unsplash.com/photo-1491002052546-bf38f186af56?${imageQuality}`;
    } else if (iconCode.includes('50')) { // Mist
        gradientVar = 'var(--gradient-mist)';
        imageUrl = `https://images.unsplash.com/photo-1487621167335-56c28716e41a?${imageQuality}`;
    }

    if (gradientVar) {
        body.style.backgroundImage = gradientVar;
    } else {
        body.style.backgroundImage = 'none';
        body.style.backgroundColor = 'var(--primary-bg)';
    }

    if (imageUrl) {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            body.style.backgroundImage = `url('${imageUrl}'), ${gradientVar}`;
        };
    }
};

const showMessage = (message, isLoading = false) => {
    messageBox.innerHTML = ''; 
    if (isLoading) {
        const spinner = document.createElement('div');
        spinner.className = 'spinner-loader';
        messageBox.appendChild(spinner);
    }
    const text = document.createElement('span');
    text.textContent = message;
    messageBox.appendChild(text);
};

const clearMessage = () => {
    messageBox.textContent = '';
};

searchBtn.addEventListener('click', fetchWeather);

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        fetchWeather();
    }
});