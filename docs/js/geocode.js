// =========================================
// FFS Venue Geocoder
// v1.0
// =========================================

async function geocodeVenues() {

    const venues = FFS.data.venues;

    for (const id in venues) {

        const venue = venues[id];

        if (venue.lat && venue.lon) {

            console.log(`${id} already geocoded.`);
            continue;

        }

        const address =
            `${venue.address}, ${venue.city}, ${venue.state} ${venue.zip}`;

        const url =
            `https://geocode.maps.co/search?q=${encodeURIComponent(address)}`;

        try {

            const response = await fetch(url);

            const results = await response.json();

            if (!results.length) {

                console.warn(`${id} not found.`);
                continue;

            }

            venue.lat =
                parseFloat(results[0].lat);

            venue.lon =
                parseFloat(results[0].lon);

            console.log(`${id} ✔`, venue.lat, venue.lon);

        }

        catch (error) {

            console.error(id, error);

        }

    }

    console.log("Finished!");

    const blob = new Blob(
    [JSON.stringify(venues, null, 2)],
    { type: "application/json" }
);

const a = document.createElement("a");

a.href = URL.createObjectURL(blob);

a.download = "venues.json";

a.click();

console.log("✅ Downloaded updated venues.json");

}
