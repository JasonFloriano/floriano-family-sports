// ======================================================
// Floriano Family Sports (FFS)
// Core Data Engine v2.0
// ======================================================

const FFS = {

    // ==================================================
    // Data Stores
    // ==================================================

    data: null,

    calendar: {

    events: [],

    async load(config) {

    try {

        const url =
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(config.calendarId)}/events` +
            `?key=${config.apiKey}` +
            `&singleEvents=true` +
            `&orderBy=startTime`;

        console.log(url);

        const response = await fetch(url);

        console.log(response.status);

        const data = await response.json();

        console.log(data);

        this.events = data.items || [];

        console.log("📅 Calendar Loaded");

        console.log(this.events);

    }

    catch(error){

        console.error(error);

    }

}

    // ==================================================
    // Initialize
    // ==================================================

    async init() {

    this.data = await loadData();

    await this.calendar.load(this.config);

    console.log("🏆 FFS Initialized");

    this.renderNextGame();

},

    // ==================================================
    // Lookup Functions
    // ==================================================

    getAthlete(id) {
        return this.data.athletes[id];
    },

    getTeam(id) {
        return this.data.teams[id];
    },

    getVenue(id) {
        return this.data.venues[id];
    },

    getOpponent(id) {
        return this.data.opponents[id];
    },

    // ==================================================
    // Calendar
    // ==================================================

    loadCalendar(events) {

        this.calendar.events = events;

        console.log("📅 Calendar Loaded");
        console.log(this.calendar.events);

        this.renderNextGame();

    },
config: {

    calendarId: "571551bd31f9314f7a0a70c01d74605b594b4bc6c5951d8d72657c53c268e6a1@group.calendar.google.com",

    apiKey: "AIzaSyCSUm0-2IIUX_bDPnqXUY6O0lBAbgeEFVc"

},
    getNextGame() {

        // Temporary event until Google Calendar is connected

        if (this.calendar.events.length === 0) {

            const event = {

                ATHLETEID: "ADDISON",
                TEAMID: "EHS_FJV_VB",
                VENUEID: "EHS",
                OPPONENTID: "FULL",

                FACILITY: "GYM",
                TYPE: "LEAGUE",

                DATE: "Thursday, August 13, 2026",
                TIME: "4:00 PM",

                HOME: true

            };

            return this.getEventDetails(event);

        }

        return this.getEventDetails(this.calendar.events[0]);

    },

    // ==================================================
    // Event Builder
    // ==================================================

    getEventDetails(event) {

        return {

            ...event,

            athlete: this.getAthlete(event.ATHLETEID),

            team: this.getTeam(event.TEAMID),

            venue: this.getVenue(event.VENUEID),

            opponent: this.getOpponent(event.OPPONENTID)

        };

    },

    // ==================================================
    // UI
    // ==================================================

    renderNextGame() {

        const game = this.getNextGame();

        const school = game.opponent.school.replace(" High School", "");

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

    // ==================================================
    // Debug
    // ==================================================

    showAthletes() {
        console.table(this.data.athletes);
    },

    showTeams() {
        console.table(this.data.teams);
    },

    showVenues() {
        console.table(this.data.venues);
    },

    showOpponents() {
        console.table(this.data.opponents);
    },

    showCalendar() {
        console.table(this.calendar.events);
    }

};
