const input = document.getElementById("city_input")

async function searchCity(city_name) {

    if (!city_name) {
        console.error("Please, enter city name...");
        return;
    }

    const apiKey = CONFIG.WEATHER_API_KEY;
    // OpenWeather API: units=metric turns Kelvin to Celsius
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${apiKey}&units=metric`;

    try {
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            if (respuesta.status === 404) {
                throw new Error("City not found, please try again...");
            } else {
                throw new Error("Error while trying to get climate data.");
            }
        }

        const datos = await respuesta.json();
        
        getClimate(datos);
        getCityPicture(city_name);
    } catch (error) {
        console.error("Error: ", error.message);
    }

}

function getCityPicture(city_name) {
    var url = "https://en.wikipedia.org/w/api.php"; 

    var params = {
        action: "query",
        generator: "search",
        gsrsearch: city_name,
        gsrlimit: "5",
        prop: "pageimages",
        piprop: "thumbnail",
        pithumbsize: "800",
        format: "json"
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function(key){
        url += "&" + key + "=" + encodeURIComponent(params[key]);
    });

    fetch(url)
    .then(function(response){ return response.json(); })
    .then(function(response) {

        if (!response.query || !response.query.pages) {
            throw new Error("There are no images of this place.");
        }

        var pages = response.query.pages;
        
        for (var page in pages) {
            if (pages[page].thumbnail && pages[page].thumbnail.source) {
                var urlRealDeLaImagen = pages[page].thumbnail.source;
                document.getElementById("city_image").src = urlRealDeLaImagen;
                return;
            }
        }
    })
    .catch(function(error){
        document.getElementById("city_image").src = "img/default.png";
    });
}

function getClimate(datos) {

    document.getElementById("city_name").innerHTML = datos.name;
    document.getElementById("city_code").innerHTML = " "+datos.sys.country;
    document.getElementById("city_temp").innerHTML = Math.round(datos.main.temp) + "°C";
    document.getElementById("city_description").innerHTML = datos.weather[0].description;
    document.getElementById("city_humidity").innerHTML = "H: "+ datos.main.humidity + "%";
    document.getElementById("city_term").innerHTML = "Feels like: "+ datos.main.feels_like + "°C";
    document.getElementById("city_wind").innerHTML = "Wind speed: "+ datos.wind.speed + " km/h";
    document.getElementById("city_presure").innerHTML = "Pressure: "+ datos.main.pressure + " hPa";
    document.getElementById("city_visibility").innerHTML = "Visibility: "+ datos.visibility +" m";
    document.getElementById("city_temp_max").innerHTML = " ▲ "+ Math.round(datos.main.temp_max) + "°";
    document.getElementById("city_temp_min").innerHTML = " ▼ "+ Math.round(datos.main.temp_min)+ "°";
    document.getElementById("city_timezone").innerHTML = "Local time: "+ getLocalTime(datos.timezone);

    getMoonPhase(getTodayMoonPhase());
    setIcon(datos.weather[0].description);

}

// Converts OpenWeather's timezone offset (seconds) into the target city's actual clock time
function getLocalTime(time){
    const timezoneOffset = time; 

    const utcTime = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
    const localCityTime = new Date(utcTime + (timezoneOffset * 1000));

    const localTime = localCityTime.toLocaleTimeString([], {
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
    });

    return localTime;
}

// Calculates the current lunar cycle decimal (0 to 1) based on a 29.53-day synodic month
function getTodayMoonPhase() {
    const today = new Date();
    const lunarMonth = 2551443;
    
    const baseNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0)); 
    const currentPhase = ((today.getTime() - baseNewMoon.getTime()) / 1000) % lunarMonth;
    
    return currentPhase / lunarMonth; 
}

function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

function toggleTheme() {
    if (localStorage.getItem('theme') === 'theme-dark'){
        setTheme('theme-light');
        document.getElementById("general_section").style.backgroundImage = "url('../img/clear_clouds.jpg')";
    } else {
        setTheme('theme-dark');
        document.getElementById("general_section").style.backgroundImage = "url('../img/dark_clouds.jpg')";
    }
}

(function () {
   if (localStorage.getItem('theme') === 'theme-dark') {
       setTheme('theme-dark');
   } else {
       setTheme('theme-light');
   }
})();

document.addEventListener("DOMContentLoaded", () => {
    const city = "Guangzhou"
    searchCity(city);

    toggleTheme();
});

document.getElementById("city_btn").addEventListener('click', function(event) {
    const city = input.value
    searchCity(city);
});

function setIcon(weather){
    switch (weather) {
    case 'clear sky':
        document.getElementById('weather_icon').textContent = '☀️';
        break;
    case 'few clouds':
        document.getElementById('weather_icon').textContent = '🌤️';
        break;
    case 'scattered clouds':
        document.getElementById('weather_icon').textContent = '⛅';
        break;
    case 'broken clouds':
    case 'overcast clouds':
        document.getElementById('weather_icon').textContent = '☁️';
        break;

    case 'light rain':
    case 'light intensity shower rain':
        document.getElementById('weather_icon').textContent = '🌦️';
        break;
    case 'moderate rain':
    case 'heavy intensity rain':
    case 'very heavy rain':
    case 'extreme rain':
    case 'shower rain':
    case 'heavy intensity shower rain':
    case 'ragged shower rain':
        document.getElementById('weather_icon').textContent = '🌧️';
        break;
    case 'freezing rain':
        document.getElementById('weather_icon').textContent = '🥶🌧️';
        break;

    case 'thunderstorm with light rain':
    case 'thunderstorm with rain':
    case 'thunderstorm with heavy rain':
    case 'light thunderstorm':
    case 'thunderstorm':
    case 'heavy thunderstorm':
    case 'ragged thunderstorm':
    case 'thunderstorm with light drizzle':
    case 'thunderstorm with drizzle':
    case 'thunderstorm with heavy drizzle':
        document.getElementById('weather_icon').textContent = '⛈️';
        break;

    case 'light snow':
    case 'snow':
    case 'heavy snow':
    case 'sleet':
    case 'light shower sleet':
    case 'shower sleet':
    case 'light rain and snow':
    case 'rain and snow':
    case 'light shower snow':
    case 'shower snow':
    case 'heavy shower snow':
        document.getElementById('weather_icon').textContent = '🌨️';
        break;

    case 'mist':
    case 'smoke':
    case 'haze':
    case 'fog':
    case 'sand/dust whirls':
    case 'sand':
    case 'dust':
    case 'volcanic ash':
        document.getElementById('weather_icon').textContent = '🌫️';
        break;
    case 'squalls':
        document.getElementById('weather_icon').textContent = '💨';
        break;
    case 'tornado':
        document.getElementById('weather_icon').textContent = '🌪️';
        break;

    case 'light intensity drizzle':
    case 'drizzle':
    case 'heavy intensity drizzle':
        document.getElementById('weather_icon').textContent = '🌦️';
        break;

    default:
        document.getElementById('weather_icon').textContent = '❓';
        break;
    }
}

function getMoonPhase(phase) {
    switch (true) {
        case (phase === 0 || phase === 1):
            document.getElementById("moon_img").src = "img/moon_phases/newMoon.png";
            document.getElementById("moon_img").style.transform = "scaleX(1)"; 
            break;
            
        case (phase > 0 && phase < 0.25):
            document.getElementById("moon_img").src = "img/moon_phases/growing.png";
            document.getElementById("moon_img").style.transform = "scaleX(1)"; 
            break;
            
        case (phase === 0.25):
            document.getElementById("moon_img").src = "img/moon_phases/quarter.png";
            document.getElementById("moon_img").style.transform = "scaleX(1)"; 
            break;
            
        case (phase > 0.25 && phase < 0.5):
            document.getElementById("moon_img").src = "img/moon_phases/gibosa.png";
            document.getElementById("moon_img").style.transform = "scaleX(1)"; 
            break;
            
        case (phase === 0.5):
            document.getElementById("moon_img").src = "img/moon_phases/fullMoon.png";
            document.getElementById("moon_img").getElementById("moon_img").style.transform = "scaleX(-1)"; 
            break;
            
        case (phase > 0.5 && phase < 0.75):
            document.getElementById("moon_img").src = "img/moon_phases/gibosa.png";
            document.getElementById("moon_img").style.transform = "scaleX(-1)"; 
            break;
            
        case (phase === 0.75):
            document.getElementById("moon_img").src = "img/moon_phases/quarter.png";
            document.getElementById("moon_img").style.transform = "scaleX(-1)"; 
            break;
            
        case (phase > 0.75 && phase < 1):
            document.getElementById("moon_img").src = "img/moon_phases/growing.png";
            document.getElementById("moon_img").style.transform = "scaleX(-1)"; 
            break;
            
        default:
            document.getElementById("moon_img").src = "img/moon_phases/fullMoon.png";
            document.getElementById("moon_img").style.transform = "scaleX(1)"; 
    }
}