// =========================================
// FFS Venue Map Module v1.0
// =========================================

const Maps = {

    getMap(event) {

    const venue = event.venue;

    if (!venue || !venue.lat || !venue.lon) {
        return "";
    }

    const lat = Number(venue.lat);
    const lon = Number(venue.lon);

    const south = lat - 0.004;
    const north = lat + 0.004;
    const west = lon - 0.004;
    const east = lon + 0.004;

    return `

<div class="map-card">

    <div class="map-title">
        VENUE
    </div>

    <iframe
        class="venue-map"
        loading="lazy"
        src="https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik&marker=${lat}%2C${lon}">
    </iframe>

</div>

`;

}
