// =========================================
// FFS Venue Geocoder v2.0
// Powered by OpenStreetMap Nominatim
// =========================================

const Geocoder = {

    async sleep(ms) {

        return new Promise(resolve =>
            setTimeout(resolve, ms)
        );

    },

    async geocodeVenue(id, venue) {

        if (venue.lat && venue.lon) {

            console.log(`✅ ${id} already has coordinates.`);

            return venue;

        }

        if (!venue.address) {

            console.warn(`⚠️ ${id} missing address.`);

            return venue;

        }

        const address =
            `${venue.address}, ${venue.city}, ${venue.state} ${venue.zip}`;

        const url =
            `https://nominatim.openstreetmap.org/search?` +
            `format=jsonv2&q=${encodeURIComponent(address)}`;

        try {

            const response = await fetch(url, {

                headers: {

                    "Accept": "application/json"

                }

            });

            const results = await response.json();

            if (!results.length) {

                console.warn(`❌ ${id} not found.`);

                return venue;

            }

            venue.lat =
                Number(results[0].lat).toFixed(6);

            venue.lon =
                Number(results[0].lon).toFixed(6);

            console.log(
                `📍 ${id}`,
                venue.lat,
                venue.lon
            );

        }

        catch (error) {

            console.error(`❌ ${id}`, error);

        }

        return venue;

    },

    async geocodeAll() {

        const venues = FFS.data.venues;

        console.clear();

        console.log("================================");

        console.log("FFS Venue Geocoder v2.0");

        console.log("================================");

        const ids = Object.keys(venues);

        for (let i = 0; i < ids.length; i++) {

            const id = ids[i];

            console.log(
                `[${i + 1}/${ids.length}] ${id}`
            );

            await this.geocodeVenue(id, venues[id]);

            // Respect Nominatim usage policy
            await this.sleep(1200);

        }

        console.log("");

        console.log("✅ Finished!");

        console.log("Downloading venues.json...");

        const blob = new Blob(

            [
                JSON.stringify(
                    venues,
                    null,
                    2
                )
            ],

            {
                type: "application/json"
            }

        );

        const link =
            document.createElement("a");

        link.href =
            URL.createObjectURL(blob);

        link.download =
            "venues.json";

        link.click();

        URL.revokeObjectURL(link.href);

    }

};
