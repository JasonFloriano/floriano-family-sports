// =========================================
// Floriano Family Sports
// Family Dashboard v1.4.1
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
        event.opponent?.school
            ? `${event.opponent.school}${event.opponent.mascot ? ` • ${event.opponent.mascot}` : ""}`
            : event.display?.opponent ??
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
                     target="_blank"
                     rel="noopener">

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

    // IMPORTANT:
    // Use ALL calendar events here.
    // Do NOT use FFS.getUpcomingEvents(),
    // because that removes games once their
    // start time has passed.

    let events = FFS.calendar.events
        .slice()
        .sort((a, b) => a.start - b.start)
        .map(event => FFS.getEventDetails(event));

    // Athlete dashboard
    if (App.athlete) {

        events = events.filter(
            event => event.ATHLETEID === App.athlete
        );

    }

    // Family dashboard filters
    else if (activeFilter !== "ALL") {

        events = events.filter(
            event => event.ATHLETEID === activeFilter
        );

    }

    console.log("Filtered Events:", events);

    return events;

}

// =========================================
// Date Helpers
// =========================================

function isSameDay(date1, date2) {

    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );

}

function isToday(event) {

    return isSameDay(
        event.start,
        new Date()
    );

}

function isFutureDay(event) {

    const today = new Date();

    const eventDate = new Date(
        event.start.getFullYear(),
        event.start.getMonth(),
        event.start.getDate()
    );

    const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    return eventDate > todayDate;

}

function isFutureEvent(event) {

    return event.start > new Date();

}

// =========================================
// NEXT GAME CONFIGURATION
// =========================================
//
// A timed LEAGUE or TOURNAMENT game remains
// the active NEXT GAME for 75 minutes after
// its scheduled start.
//
// After 75 minutes, FFS moves to the next
// chronological qualifying game.
//
// Future games always qualify.
//
// Practices, school events, and all-day
// events are NOT eligible for NEXT GAME.
//

const GAME_DISPLAY_WINDOW =
    75 * 60 * 1000;

// =========================================
// Countdown Timer
// =========================================

function getCountdown(start) {

    const diff = start - new Date();

    if (diff <= 0) {

        return {

            days: "LIVE",
            hours: "NOW",
            dayLabel: "",
            hourLabel: ""

        };

    }

    const days = Math.floor(
        diff / 86400000
    );

    const hours = Math.floor(
        (diff % 86400000) / 3600000
    );

    const minutes = Math.floor(
        (diff % 3600000) / 60000
    );

    if (days > 0) {

        return {

            days,
            hours,
            dayLabel: "DAYS",
            hourLabel: "HOURS"

        };

    }

    return {

        days: hours,
        hours: minutes,
        dayLabel: "HOURS",
        hourLabel: "MINUTES"

    };

}

// =========================================
// Render Dashboard
// =========================================

async function renderAll() {

    const events = getFilteredEvents();

    console.log("=================================");
    console.log("FFS FAMILY DASHBOARD");
    console.log("Total Events:", events.length);
    console.log("Today:", events.filter(isToday));
    console.log("Future:", events.filter(isFutureEvent));
    console.log("=================================");

    // =====================================
    // TODAY
    // =====================================

    const today =
        events.filter(isToday);

    // =====================================
    // NEXT GAME
    // =====================================
    //
    // A timed LEAGUE or TOURNAMENT game
    // remains the active NEXT GAME for
    // 75 minutes after its scheduled start.
    //
    // Future games always qualify.
    //
    // Practices, school events, and all-day
    // events are NOT eligible.
    //

const now =
    new Date();

const currentOrNext =
    events
        .filter(event => {

            // ---------------------------------
            // NORMALIZE EVENT TYPE
            // ---------------------------------

            const type =
                String(event.TYPE || "")
                    .trim()
                    .toUpperCase();

            // ---------------------------------
            // ONLY ACTUAL GAMES
            // ---------------------------------

            if (
                !["LEAGUE", "TOURNAMENT"]
                    .includes(type)
            ) {
                return false;
            }

            // ---------------------------------
            // ONLY TIMED EVENTS
            // ---------------------------------

            if (!event.isTimed) {
                return false;
            }

            // ---------------------------------
            // VALID START TIME REQUIRED
            // ---------------------------------

            if (
                !(event.start instanceof Date) ||
                Number.isNaN(
                    event.start.getTime()
                )
            ) {
                return false;
            }

            // ---------------------------------
            // CALCULATE ELAPSED TIME
            // ---------------------------------

            const elapsed =
                now.getTime() -
                event.start.getTime();

            // ---------------------------------
            // QUALIFICATION
            // ---------------------------------
            //
            // Future games qualify.
            //
            // Games that started less than
            // 75 minutes ago also qualify.
            //

            return (
                elapsed <
                GAME_DISPLAY_WINDOW
            );

        })

        // ---------------------------------
        // EARLIEST QUALIFYING GAME WINS
        // ---------------------------------

        .sort(
            (a, b) =>
                a.start.getTime() -
                b.start.getTime()
        )[0];

    // =====================================
    // NEXT GAME CONTAINER
    // =====================================

    const nextContainer =
        document.querySelector(".next-up");

    if (currentOrNext) {

        const game =
            currentOrNext;

        const opponent =
            game.opponent?.school
                ? `${game.opponent.school}${game.opponent.mascot ? ` • ${game.opponent.mascot}` : ""}`
                : game.display?.opponent ??
                  game.TYPE;

        const venue =
            game.display?.venue ??
            game.venue?.name ??
            "";

        const countdown =
            getCountdown(
                game.start
            );

        let weather = "";

        try {

            weather =
                await Weather.getForecast(
                    game
                );

        } catch (error) {

            console.warn(
                "Weather unavailable:",
                error
            );

        }

        if (nextContainer) {

            nextContainer.innerHTML = `

<h2>NEXT GAME</h2>

<div class="hero-card">

    <h3>${game.athlete.name}</h3>

    <div class="hero-badge ${game.TYPE.toLowerCase()}">
        ${
            game.TYPE === "LEAGUE"
                ? "LEAGUE GAME"
                : game.TYPE
        }
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

                <div
                    id="countdown-days"
                    class="count-value">
                    ${countdown.days}
                </div>

                <div
                    id="countdown-day-label"
                    class="count-unit">
                    ${countdown.dayLabel}
                </div>

            </div>

            <div class="count-box">

                <div
                    id="countdown-hours"
                    class="count-value">
                    ${countdown.hours}
                </div>

                <div
                    id="countdown-hour-label"
                    class="count-unit">
                    ${countdown.hourLabel}
                </div>

            </div>

        </div>

    </div>

    ${weather}

    ${
        game.display?.directions
            ? `
<a
    class="venue-card"
    href="${game.display.directions}"
    target="_blank"
    rel="noopener">

    <div class="venue-title">
        📍 GAME LOCATION
    </div>

    <div class="venue-name">
        🏫 ${game.venue?.name || venue}
    </div>

    <div class="venue-address">
        ${game.venue?.address || ""}
    </div>

    <div class="venue-city">
        ${
            game.venue
                ? `${game.venue.city}, ${game.venue.state} ${game.venue.zip}`
                : ""
        }
    </div>

    <div class="venue-action">
        🧭 Open in Google Maps →
    </div>

</a>
`
            : ""
    }

</div>

`;

        }

    } else {

        if (nextContainer) {

            nextContainer.innerHTML = "";

        }

    }

    // =====================================
    // TODAY SECTION
    // =====================================

    renderSection(
        "#today",
        "TODAY",
        today
    );

    // =====================================
    // UPCOMING SECTION
    // =====================================
    //
    // Only show events on FUTURE DAYS.
    //
    // Today → TODAY
    // Tomorrow/later → UPCOMING
    //

    const upcoming =
        events
            .filter(isFutureDay)
            .slice(0, 10);

    renderSection(
        "#week",
        activeFilter === "ALL"
            ? "UPCOMING"
            : `UPCOMING • ${activeFilter}`,
        upcoming
    );

    // =====================================
    // COUNTDOWN UPDATE
    // =====================================
    //
    // Update every minute.
    //
    // When the current game's 75-minute
    // display window expires, automatically
    // rebuild the dashboard and select
    // the next chronological game.
    //

    clearInterval(
        window.countdownTimer
    );

    window.countdownTimer =
        setInterval(
            async () => {

                // ---------------------------------
                // NO CURRENT GAME
                // ---------------------------------

                if (!currentOrNext) {

                    await renderAll();

                    return;

                }

                const currentTime =
                    new Date();

                const elapsed =
                    currentTime.getTime() -
                    currentOrNext.start.getTime();

                // ---------------------------------
                // 75-MINUTE WINDOW EXPIRED
                // ---------------------------------

                if (
                    elapsed >=
                    GAME_DISPLAY_WINDOW
                ) {

                    console.log(
                        "⏭️ NEXT GAME window expired — advancing."
                    );

                    await renderAll();

                    return;

                }

                // ---------------------------------
                // UPDATE COUNTDOWN
                // ---------------------------------

                const countdown =
                    getCountdown(
                        currentOrNext.start
                    );

                const days =
                    document.getElementById(
                        "countdown-days"
                    );

                const hours =
                    document.getElementById(
                        "countdown-hours"
                    );

                const dayLabel =
                    document.getElementById(
                        "countdown-day-label"
                    );

                const hourLabel =
                    document.getElementById(
                        "countdown-hour-label"
                    );

                if (days)
                    days.textContent =
                        countdown.days;

                if (hours)
                    hours.textContent =
                        countdown.hours;

                if (dayLabel)
                    dayLabel.textContent =
                        countdown.dayLabel;

                if (hourLabel)
                    hourLabel.textContent =
                        countdown.hourLabel;

            },
            60000
        );

}

// =========================================
// Filter Chips
// =========================================

function setupFilters() {

    const buttons =
        document.querySelectorAll(
            ".filter"
        );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                buttons.forEach(b =>
                    b.classList.remove("active")
                );

                button.classList.add(
                    "active"
                );

                activeFilter =
                    button.dataset.athlete
                        .toUpperCase();

                renderAll();

            }
        );

    });

}

// =========================================
// Initialize
// =========================================

async function initFamily() {

    try {

        await FFS.init();

        setupFilters();

        await renderAll();

    } catch (error) {

        console.error(
            "FFS Family Dashboard Error:",
            error
        );

    }

}

document.addEventListener(
    "DOMContentLoaded",
    initFamily
);