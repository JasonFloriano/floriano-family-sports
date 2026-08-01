// =========================================
// FFS Weather Module v2.0
// Game Time Forecast
// =========================================

const Weather = {

    async getForecast(event) {

        const venue = event.venue;

        if (!venue || !venue.lat || !venue.lon) {
            return "";
        }

        try {

            const url =
                `https://api.open-meteo.com/v1/forecast` +
                `?latitude=${venue.lat}` +
                `&longitude=${venue.lon}` +
                `&hourly=temperature_2m,weathercode,wind_speed_10m,precipitation_probability` +
                `&temperature_unit=fahrenheit` +
                `&wind_speed_unit=mph` +
                `&timezone=auto`;

            const response = await fetch(url);
const data = await response.json();

if (!data.hourly || !data.hourly.time) {

    return "";

}

const gameDate =
    event.start.toISOString().split("T")[0];

            const gameHour =
                String(event.start.getHours()).padStart(2, "0");

            const index = data.hourly.time.findIndex(time =>
                time.startsWith(`${gameDate}T${gameHour}`)
            );

            if (index === -1) {
                return "";
            }

            const temp =
                Math.round(data.hourly.temperature_2m[index]);

            const wind =
                Math.round(data.hourly.wind_speed_10m[index]);

            const rain =
                data.hourly.precipitation_probability[index];

            const code =
                data.hourly.weathercode[index];

            return `

<div class="weather-card">

    <div class="weather-title">

        GAME TIME FORECAST

    </div>

    <div class="weather-icon">

        ${this.getWeatherIcon(code)}

    </div>

    <div class="weather-temp">

        ${temp}°

    </div>

    <div class="weather-desc">

        ${this.getWeatherDescription(code)}

    </div>

    <div class="weather-extra">

        💨 ${wind} mph&nbsp;&nbsp;&nbsp;☔ ${rain}%

    </div>

</div>

`;

        }

        catch (error) {

            console.error("Weather Error:", error);

            return "";

        }

    },

    getWeatherDescription(code) {

        switch (code) {

            case 0: return "Clear Sky";
            case 1:
            case 2: return "Mostly Sunny";
            case 3: return "Cloudy";

            case 45:
            case 48: return "Fog";

            case 51:
            case 53:
            case 55: return "Drizzle";

            case 61:
            case 63:
            case 65: return "Rain";

            case 71:
            case 73:
            case 75: return "Snow";

            case 80:
            case 81:
            case 82: return "Rain Showers";

            case 95: return "Thunderstorms";

            default: return "Fair";

        }

    },

    getWeatherIcon(code) {

        if (code === 0) return "☀️";

        if (code <= 2) return "🌤️";

        if (code === 3) return "☁️";

        if (code <= 48) return "🌫️";

        if (code <= 67) return "🌦️";

        if (code <= 82) return "🌧️";

        if (code <= 86) return "❄️";

        if (code >= 95) return "⛈️";

        return "🌤️";

    }

};
