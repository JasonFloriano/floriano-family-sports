// =========================================
// Floriano Family Sports
// Weather Module v1.0
// =========================================

const Weather = {

    async getForecast(event) {

        if (!event?.venue) {

            return `
                <div class="weather-card">

                    Weather unavailable

                </div>
            `;

        }

        // API call goes here

        return `
            <div class="weather-card">

                ☀️ 82°

                <div class="weather-desc">

                    Mostly Sunny

                </div>

            </div>
        `;

    }

};
