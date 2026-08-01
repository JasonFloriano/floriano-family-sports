// =========================================
// Floriano Family Sports
// Weather Module v2.0
// =========================================

const Weather = {

    async getForecast(event){

        if(!event?.venue){

            return "";

        }

        const { lat, lon } = event.venue;

        if(lat == null || lon == null){

            return "";

        }

        try{

            const response = await fetch(

                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`

            );

            if(!response.ok){

                throw new Error("Weather request failed");

            }

            const data = await response.json();

            const temp =
                Math.round(data.current.temperature_2m);

            const code =
                data.current.weather_code;

            return `

<div class="weather-card">

    <div class="weather-icon">

        ${this.getIcon(code)}

    </div>

    <div class="weather-temp">

        ${temp}°

    </div>

    <div class="weather-desc">

        ${this.getDescription(code)}

    </div>

</div>

`;

        }

        catch(error){

            console.error("Weather:", error);

            return "";

        }

    },

    getIcon(code){

        if(code === 0) return "☀️";

        if(code <= 3) return "🌤️";

        if(code <= 48) return "☁️";

        if(code <= 67) return "🌧️";

        if(code <= 77) return "❄️";

        return "⛈️";

    },

    getDescription(code){

        if(code === 0) return "Clear Sky";

        if(code <= 3) return "Partly Cloudy";

        if(code <= 48) return "Cloudy";

        if(code <= 67) return "Rain";

        if(code <= 77) return "Snow";

        return "Thunderstorms";

    }

};
