// =========================================
// Floriano Family Sports
// Weather Module v3.0
// =========================================

const Weather = {

    async getForecast(event) {

        const venue = event.venue;

        if (!venue?.lat || !venue?.lon) {

            return "";

        }

        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${venue.lat}` +
            `&longitude=${venue.lon}` +
            `&hourly=temperature_2m,weathercode,windspeed_10m,precipitation_probability` +
            `&temperature_unit=fahrenheit` +
            `&wind_speed_unit=mph` +
            `&timezone=auto`;

        const response = await fetch(url);

        const data = await response.json();

        const gameHour = event.start.getHours();

        const gameDate = event.start.toISOString().split("T")[0];

        const index = data.hourly.time.findIndex(time =>

            time.startsWith(`${gameDate}T${String(gameHour).padStart(2,"0")}`)

        );

        if (index === -1) {

            return "";

        }

        const temp = Math.round(data.hourly.temperature_2m[index]);

        const wind = Math.round(data.hourly.windspeed_10m[index]);

        const rain = data.hourly.precipitation_probability[index];

        const description =
            this.getWeatherDescription(
                data.hourly.weathercode[index]
            );

        return `

<div class="weather-card">

    <div class="weather-title">

        GAME TIME FORECAST

    </div>

    <div class="weather-icon">

        ${this.getWeatherIcon(data.hourly.weathercode[index])}

    </div>

    <div class="weather-temp">

        ${temp}°

    </div>

    <div class="weather-desc">

        ${description}

    </div>

    <div class="weather-extra">

        💨 ${wind} mph &nbsp;&nbsp; ☔ ${rain}%

    </div>

</div>

`;

    },
