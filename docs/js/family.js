// =========================================
// Floriano Family Sports
// Family Dashboard v1.3.1
// =========================================

let activeFilter = "ALL";

// =========================================
// Dashboard Configuration
// =========================================

const DashboardConfig = {

    family: {

        athlete: null,

        showFilters: true,

        title: "Family Dashboard"

    },

    ryley: {

        athlete: "RYLEY",

        showFilters: false,

        title: "Ryley's Dashboard"

    },

    addison: {

        athlete: "ADDISON",

        showFilters: false,

        title: "Addison's Dashboard"

    }

};

const App = DashboardConfig[DASHBOARD || "family"];

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

    console.log("First Event:");
    console.log(events[0]);

    return events;

}

    // Family Dashboard filter chips
    else if (activeFilter !== "ALL") {

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

// =========================================
// Render Dashboard
// =========================================

// =========================================
// Render Dashboard
// =========================================

async function renderAll() {

    const upcoming = getFilteredEvents();
console.log("Dashboard:", DASHBOARD);
console.log("App:", App);
console.log("Upcoming Count:", upcoming.length);
console.log(upcoming);

    const today = upcoming.filter(event =>
        event.start.toDateString() === new Date().toDateString()
    );

    const nextContainer = document.querySelector(".next-up");

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

        const countdown = getCountdown(game.start);
        
const weather =
    await Weather.getForecast(game);
        
        nextContainer.innerHTML = `

<h2>NEXT GAME</h2>

<div class="hero-card">

    <h3>${game.athlete.name}</h3>

<div class="hero-badge ${game.TYPE.toLowerCase()}">
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

    <div class="countdown">

        <div class="countdown-label">
            STARTS IN
        </div>

        <div class="countdown-grid">

            <div class="count-box">

                <div id="countdown-days" class="count-value">
                    ${countdown.days}
                </div>

                <div id="countdown-day-label" class="count-unit">
                    ${countdown.dayLabel}
                </div>

            </div>

            <div class="count-box">

                <div id="countdown-hours" class="count-value">
                    ${countdown.hours}
                </div>

                <div id="countdown-hour-label" class="count-unit">
                    ${countdown.hourLabel}
                </div>

            </div>

        </div>

    </div>

${weather}

<a
    class="venue-card"
    href="${game.display.directions}"
    target="_blank"
    rel="noopener">

    <div class="venue-title">
        📍 GAME LOCATION
    </div>

    <div class="venue-name">
        🏫 ${game.venue.name}
    </div>

    <div class="venue-address">
        ${game.venue.address}
    </div>

    <div class="venue-city">
        ${game.venue.city}, ${game.venue.state} ${game.venue.zip}
    </div>

    <div class="venue-action">
        🧭 Open in Google Maps →
    </div>

</a>
</div>

`;

    } else {

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

        if (upcoming.length === 0) return;

        const countdown = getCountdown(upcoming[0].start);

        const days = document.getElementById("countdown-days");
        const hours = document.getElementById("countdown-hours");
        const dayLabel = document.getElementById("countdown-day-label");
        const hourLabel = document.getElementById("countdown-hour-label");

        if (days) days.textContent = countdown.days;
        if (hours) hours.textContent = countdown.hours;
        if (dayLabel) dayLabel.textContent = countdown.dayLabel;
        if (hourLabel) hourLabel.textContent = countdown.hourLabel;

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
