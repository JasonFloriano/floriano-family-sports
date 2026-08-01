// =========================================
// Floriano Family Sports
// Weather Module v1.0
// =========================================

const Weather = {

    async getForecast(event){

        if(!event?.venue){

            return `
                <div class="weather-card">

                    Weather unavailable

                </div>
            `;

        }

        // TODO:
        // Open-Meteo API

        return `

<div class="weather-card">

    <div class="weather-icon">

        ☀️

    </div>

    <div class="weather-temp">

        82°

    </div>

    <div class="weather-desc">

        Mostly Sunny

    </div>

</div>

`;

    }

};
