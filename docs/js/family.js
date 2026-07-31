
// =========================================
// Floriano Family Sports
// Family Calendar v1.2
// =========================================

let activeFilter = "ALL";

function badgeClass(type){
    switch((type||"").toUpperCase()){
        case "LEAGUE": return "badge league";
        case "PRACTICE": return "badge practice";
        case "TOURNAMENT": return "badge tournament";
        case "SCHOOL": return "badge school";
        default: return "badge";
    }
}

function directionsUrl(event){
    if(!event.venue) return "#";
    const addr=`${event.venue.address}, ${event.venue.city}, ${event.venue.state} ${event.venue.zip}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
}

function createEventCard(event){

    const opponent = event.opponent?.school || event.TYPE;
    const venue = event.venue?.name || "";
    const homeAway = event.HOME ? "🏠 HOME" : "🚌 AWAY";

    return `
    <article class="event-card">
        <div class="accent ${event.athlete?.id==="RF"?"ryley":"addison"}"></div>

        <div class="event-content">
            <h3>${event.athlete?.name || ""}</h3>

            <div class="meta-row">
                <span class="${badgeClass(event.TYPE)}">${event.TYPE}</span>
                <span class="homeaway">${homeAway}</span>
            </div>

            <div class="opponent">🆚 ${opponent}</div>

            <div class="info">📅 ${event.DATE}</div>
            <div class="info">🕓 ${event.TIME}</div>

            ${venue ? `<div class="info">📍 ${venue}</div>` : ""}

            ${venue ? `<a class="directions" href="${directionsUrl(event)}" target="_blank">Directions →</a>` : ""}
        </div>
    </article>`;
}

function renderSection(selector,title,events){
    document.querySelector(selector).innerHTML=
        `<h2>${title}</h2>${events.map(createEventCard).join("")}`;
}

async function initFamily(){
    await FFS.init();
    const next=FFS.getNextGame();
    if(next){
        document.querySelector(".next-up").innerHTML=`<h2>NEXT UP</h2>${createEventCard(next)}`;
    }
    renderSection("#today","TODAY",FFS.getTodaysEvents());
    renderSection("#week","UPCOMING",FFS.getUpcomingEvents().slice(0,10));
}

document.addEventListener("DOMContentLoaded",initFamily);
