// =========================================
// Floriano Family Sports
// Family Dashboard v1.3.1
// =========================================

let activeFilter = "ALL";

// =========================================
// Badge Helper
// =========================================

function badgeClass(type) {

    switch ((type || "").toUpperCase()) {

        case "LEAGUE":
            return "badge league";

        case "PRACTICE":
            return "badge practice";

        case "TOURNAMENT":                    
            return "badge tournament";

        case "SCHOOL":
            return "badge school";

        default:
            return "badge";

    }

}

// =========================================
// Directions Helper
// =========================================

function directionsUrl(event) {

    if (event.display?.directions)
        return event.display.directions;

    if (!event.venue)
        return "#";

    const address = [

        event.venue.address,
        event.venue.city,
        event.venue.state,
        event.venue.zip

    ]
    .filter(Boolean)
    .join(", ");

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

}

// =========================================
// Event Card
// =========================================

function createEventCard(event) {

    const athlete =
        event.display?.athlete ??
        event.athlete?.name ??
        "";

    const opponent =
        event.display?.opponent ??
        event.opponent?.school ??
        event.TYPE;

    const venue =
        event.display?.venue ??
        event.venue?.name ??
        "";

    const accent =
        event.display?.accent ??
        (
            event.ATHLETEID === "RYLEY"
                ? "ryley"
                : "addison"
        );

    const homeAway =
        event.display?.homeAway ??
        (
            event.HOME
                ? "🏠 HOME"
                : "🚌 AWAY"
        );

    const date =
        event.display?.shortDate ??
        event.DATE;

    return `

<article class="event-card">

    <div class="accent ${accent}"></div>

    <div class="event-content">

        <h3>${athlete}</h3>

        <div class="meta-row">

            <span class="${badgeClass(event.TYPE)}">

                ${event.TYPE}

            </span>

            <span class="homeaway">

                ${homeAway}

            </span>

        </div>

        <div class="opponent">

            🆚 ${opponent}

        </div>

        <div class="info">

            📅 ${date}

        </div>

        <div class="info">

            🕓 ${event.TIME}

        </div>

        ${
            venue
                ? `<div class="info">📍 ${venue}</div>`
                : ""
        }

        ${
            venue
                ? `<a class="directions"
                     href="${directionsUrl(event)}"
                     target="_blank">

                     Directions →

                   </a>`
                : ""
        }

    </div>

</article>

`;

}
// =========================================
// Render Helpers
// =========================================

function renderSection(selector, title, events) {

    const section = document.querySelector(selector);

    if (!section) return;

    if (events.length === 0) {

        section.innerHTML = `

<h2>${title}</h2>

<article class="event-card">

    <div class="accent"></div>

    <div class="event-content">

        <h3>No Events</h3>

        <div class="info">

            Enjoy the day!

        </div>

    </div>

</article>

`;

        return;

    }

    section.innerHTML = `

<h2>${title}</h2>

${events.map(createEventCard).join("")}

`;

}

// =========================================
// Event Filtering
// =========================================

function getFilteredEvents() {

    let events = FFS.getUpcomingEvents();

    if (activeFilter !== "ALL") {

        events = events.filter(
            event => event.ATHLETEID === activeFilter
        );

    }

    return events;

}
// ========================================
// countdown timer
//=========================================

function getCountdown(start){

    const diff = start - new Date();

    if(diff <= 0){

        return{

            days:"LIVE",

            hours:"NOW",

            dayLabel:"",

            hourLabel:""

        };

    }

    const days=Math.floor(diff/86400000);

    const hours=Math.floor((diff%86400000)/3600000);

    const minutes=Math.floor((diff%3600000)/60000);

    if(days>0){

        return{

            days,

            hours,

            dayLabel:"DAYS",

            hourLabel:"HOURS"

        };

    }

    return{

        days:hours,

        hours:minutes,

        dayLabel:"HOURS",

        hourLabel:"MINUTES"

    };

}

<div class="countdown">

    <div class="countdown-label">
        STARTS IN
    </div>

    <div class="countdown-grid">

        <div class="count-box">

            <div id="countdown-days" class="count-value">
                ${getCountdown(game.start).days}
            </div>

            <div class="count-unit">
                ${getCountdown(game.start).dayLabel}
            </div>

        </div>

        <div class="count-box">

            <div id="countdown-hours" class="count-value">
                ${getCountdown(game.start).hours}
            </div>

            <div class="count-unit">
                ${getCountdown(game.start).hourLabel}
            </div>

        </div>

    </div>

// =========================================
// Render Dashboard
// =========================================

function renderAll() {

    const upcoming = getFilteredEvents();

    const today = upcoming.filter(event =>

        event.start.toDateString() ===
        new Date().toDateString()

    );

    const nextContainer =
        document.querySelector(".next-up");

if (upcoming.length > 0) {

    const game = upcoming[0];

    const opponent =
        game.display?.opponent ??
        game.opponent?.school ??
        game.TYPE;

    const venue =
        game.display?.venue ??
        game.venue?.name ??
        "";

    nextContainer.innerHTML = `

<h2>NEXT GAME</h2>

<div class="hero-card">

    <h3>${game.athlete.name}</h3>

   <div class="${badgeClass(game.TYPE)}">

    ${game.TYPE === "LEAGUE" ? "LEAGUE GAME" : game.TYPE}

</div>

    <div class="hero-opponent">

        🆚 ${opponent}

    </div>

    <div class="hero-info">

        📅 ${game.DATE}

    </div>

    <div class="hero-info">

        🕓 ${game.TIME}

    </div>

    <div class="hero-info">

        📍 ${venue}

    </div>

</div>
    <div class="weather">

        ☀️ Weather Coming...

    </div>

    <a
        class="directions"
        href="${directionsUrl(game)}"
        target="_blank">

        Directions →

    </a>

</div>

`;

}
    else {

        nextContainer.innerHTML = "";

    }

    renderSection(
        "#today",
        "TODAY",
        today
    );

    renderSection(
        "#week",
        activeFilter === "ALL"
            ? "UPCOMING"
            : `UPCOMING • ${activeFilter}`,
        upcoming.slice(0, 10)
    );
    
clearInterval(window.countdownTimer);

window.countdownTimer = setInterval(() => {

    const countdown = document.getElementById("countdown");

    if (countdown && upcoming.length > 0) {

        countdown.textContent = getCountdown(upcoming[0].start);

    }

}, 60000);
}

// =========================================
// Filter Chips
// =========================================

function setupFilters() {

    const buttons =
        document.querySelectorAll(".filter");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(b =>
                b.classList.remove("active")
            );

            button.classList.add("active");

            activeFilter =
                button.dataset.athlete.toUpperCase();

            renderAll();

        });

    });

}

// =========================================
// Initialize
// =========================================

async function initFamily() {

    await FFS.init();

    setupFilters();

    renderAll();

}

document.addEventListener(
    "DOMContentLoaded",
    initFamily
);
