// =========================================
// FFS Venue Map Module v1.0
// =========================================

const Maps = {

    getMap(event) {

        const venue = event.venue;

        if (!venue || !venue.lat || !venue.lon) {
            return "";
        }

        const lat = venue.lat;
        const lon = venue.lon;

        return `

<div class="map-card">

    <div class="map-title">

        VENUE

    </div>

    <iframe
        class="venue-map"
        loading="lazy"
        src="https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.003}%2C${lat-0.003}%2C${Number(lon)+0.003}%2C${Number(lat)+0.003}&layer=mapnik&marker=${lat}%2C${lon}">
    </iframe>

</div>

`;

    }

};
