// =========================================
// Floriano Family Sports
// Maps Module v1.0
// =========================================

const Maps = {

    getVenueCard(event){

        if(!event?.venue){

            return "";

        }

        return `

<div class="venue-card">

    <h4>

        🗺 Venue

    </h4>

    <div>

        ${event.venue.name}

    </div>

</div>

`;

    }

};
