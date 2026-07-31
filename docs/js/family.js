// =========================================
// Floriano Family Sports
// Family Calendar v1.0
// =========================================

function createEventCard(event) {

    const opponent =
        event.opponent?.school || event.TYPE;

    const venue =
        event.venue?.name || "";

    return `

<div class="event">

    <div class="event-content">

        <h3>${event.athlete.name}</h3>

        <div class="event-type">

            ${event.TYPE}

        </div>

        <strong>${opponent}</strong>

        <p>📅 ${event.DATE}</p>

        <p>🕓 ${event.TIME}</p>

        <small>📍 ${venue}</small>

    </div>

</div>

`;

}

function renderNextUp() {

    const game = FFS.getNextGame();

    if (!game) return;

    document.querySelector(".next-up").innerHTML = `
        <h2>NEXT UP</h2>
        ${createEventCard(game)}
    `;

}

function renderToday() {

    const events = FFS.getTodaysEvents();

    document.querySelector("#today").innerHTML = `
        <h2>TODAY</h2>
        ${events.map(createEventCard).join("")}
    `;

}

function renderWeek() {

    const events = FFS.getUpcomingEvents();

    document.querySelector("#week").innerHTML = `
        <h2>UPCOMING</h2>
        ${events.slice(0,10).map(createEventCard).join("")}
    `;

}

async function initFamily() {

    await FFS.init();

    renderNextUp();

    renderToday();

    renderWeek();

}

document.addEventListener(
    "DOMContentLoaded",
    initFamily
);
