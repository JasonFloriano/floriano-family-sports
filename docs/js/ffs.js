// ======================================================
// Floriano Family Sports (FFS)
// Core Data Engine v3.1.1
// =======================================================

const FFS = {

    config: {
        calendarId: "571551bd31f9314f7a0a70c01d74605b594b4bc6c5951d8d72657c53c268e6a1@group.calendar.google.com",
        apiKey: "AIzaSyCSUm0-2IIUX_bDPnqXUY6O0lBAbgeEFVc"
    },

    data: null,

    calendar: {
        events: [],

        async load(config) {
            const url =
                `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(config.calendarId)}/events` +
                `?key=${config.apiKey}` +
                `&singleEvents=true` +
                `&orderBy=startTime`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Calendar API Error: ${response.status}`);
            }

            const json = await response.json();

            this.events = (json.items || [])
                .map(event => FFS.convertGoogleEvent(event))
                .filter(Boolean);

            console.log("📅 Calendar Loaded");
            console.table(this.events);
        }
    },

    async init() {
        this.data = await loadData();
        await this.calendar.load(this.config);
        console.log("🏆 FFS Initialized");
        //this.renderNextGame();
    },

    parseMetadata(description = "") {
        const meta = {};

        description.split(/\r?\n/).forEach(line => {
            const i = line.indexOf("=");

            if (i > -1) {
                meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
            }
        });

        return meta;
    },

    convertGoogleEvent(event) {

    const meta = this.parseMetadata(event.description || "");

    if (!meta.ATHLETEID) return null;

    const start = new Date(event.start.dateTime || event.start.date);

    return {

        ATHLETEID: meta.ATHLETEID,
        TEAMID: meta.TEAMID,
        VENUEID: meta.VENUEID,
        OPPONENTID: meta.OPPONENTID,
        FACILITY: meta.FACILITY,
        TYPE: meta.TYPE,

        // Keep the raw Date object for sorting/filtering
        start: start,

        HOME: /HOME/i.test(event.summary || ""),

        DATE: start.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }),

        TIME: event.start.dateTime
            ? start.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit"
            })
            : "TBD"

    };

},

    getAthlete(id) { return this.data.athletes[id]; },
    getTeam(id) { return this.data.teams[id]; },
    getVenue(id) { return this.data.venues[id]; },
    getOpponent(id) { return this.data.opponents[id]; },

getEventDetails(event) {

    const athlete = this.getAthlete(event.ATHLETEID);
    const team = this.getTeam(event.TEAMID);
    const venue = this.getVenue(event.VENUEID);
    const opponent = this.getOpponent(event.OPPONENTID);

    return {

        ...event,

        athlete,
        team,
        venue,
        opponent,

        display: {

            athlete: athlete?.name || "",

            opponent: opponent
                ? opponent.school
                : event.TYPE,

            venue: venue
                ? venue.name
                : "",

            badge: event.TYPE,

            homeAway: event.HOME
                ? "HOME"
                : "AWAY",

            shortDate: event.start.toLocaleDateString(
                "en-US",
                {
                    weekday: "short",
                    month: "short",
                    day: "numeric"
                }
            ),

            directions: venue
                ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${venue.address}, ${venue.city}, ${venue.state} ${venue.zip}`
                )}`
                : "",

            accent:
                event.ATHLETEID === "ADDISON"
                    ? "addison"
                    : "ryley"

        }

    };

},
getNextGame() {

    const now = new Date();

    const event = this.calendar.events.find(event =>
        ["LEAGUE", "TOURNAMENT"].includes(event.TYPE) &&
        event.start >= now
    );

    if (!event) return null;

    return this.getEventDetails(event);

},

getUpcomingEvents() {

    const now = new Date();

    return this.calendar.events
        .filter(event => event.start >= now)
        .sort((a, b) => a.start - b.start)
        .map(event => this.getEventDetails(event));

},

getTodaysEvents() {

    const today = new Date().toDateString();

    return this.getUpcomingEvents().filter(event =>
        event.start.toDateString() === today
    );

},

getAthleteSchedule(athleteId) {

    return this.getUpcomingEvents().filter(event =>
        event.ATHLETEID === athleteId
    );

},

getEventsByType(type) {

    return this.getUpcomingEvents().filter(event =>
        event.TYPE === type
    );

},

renderNextGame() {

    const game = this.getNextGame();

    if (!game) {
        console.warn("No upcoming games found.");
        return;
    }

    if (!game.opponent || !game.venue) {
        console.warn("Incomplete event", game);
        return;
    }

    const school = (game.opponent.school || "").replace(" High School", "");

    document.getElementById("next-athlete").textContent =
        `🏐 ${game.athlete.name}`;

    document.getElementById("next-opponent").textContent =
        game.HOME
            ? `🏠 HOME vs ${school} ${game.opponent.mascot}`
            : `🚌 AWAY @ ${school} ${game.opponent.mascot}`;

    document.getElementById("next-date").textContent =
        `📅 ${game.DATE}`;

    document.getElementById("next-time").textContent =
        `🕓 ${game.TIME}`;

    document.getElementById("next-venue").textContent =
        `📍 ${game.venue.name}`;

    const address =
        `${game.venue.address}, ${game.venue.city}, ${game.venue.state} ${game.venue.zip}`;

    document.getElementById("next-directions").href =
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

},

showCalendar() {
    console.table(this.calendar.events);
}

};




