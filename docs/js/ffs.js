// ======================================================
// Floriano Family Sports (FFS)
// Core Data Engine v1.2
// ======================================================

const FFS = {

    // --------------------------------------------------
    // Loaded Data
    // --------------------------------------------------

    data: null,
    calendar: {

    events: []

},

    // --------------------------------------------------
    // Initialize
    // --------------------------------------------------

    async init() {

        this.data = await loadData();

        console.log("🏆 FFS Initialized");
        console.log(this.data);

    },

    // --------------------------------------------------
    // Lookup Functions
    // --------------------------------------------------

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

    // --------------------------------------------------
    // Build Rich Event Object
    // --------------------------------------------------

    getEventDetails(event) {

        return {

            ...event,

            athlete: this.getAthlete(event.ATHLETEID),

            team: this.getTeam(event.TEAMID),

            venue: this.getVenue(event.VENUEID),

            opponent: this.getOpponent(event.OPPONENTID)

        };

    },

    // --------------------------------------------------
    // Temporary Next Game
    // (Later this will come from Google Calendar)
    // --------------------------------------------------

    getNextGame() {

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
loadCalendar(events) {

    this.calendar.events = events;

    console.log("📅 Calendar Loaded");

    console.log(this.calendar.events);

},
    // --------------------------------------------------
    // Render Next Up Card
    // --------------------------------------------------

    renderNextGame() {

    const game = this.getNextGame();

    document.getElementById("next-athlete").textContent =
        `🏐 ${game.athlete.name}`;

    document.getElementById("next-opponent").textContent =
        game.HOME
            ? `🏠 HOME vs ${game.opponent.school} ${game.opponent.mascot}`
            : `🚌 AWAY @ ${game.opponent.school} ${game.opponent.mascot}`;

    document.getElementById("next-date").textContent =
        `📅 ${game.DATE}`;

    document.getElementById("next-time").textContent =
        `🕓 ${game.TIME}`;

    document.getElementById("next-venue").textContent =
        `📍 ${game.venue.name}`;

    const address = `${game.venue.address}, ${game.venue.city}, ${game.venue.state} ${game.venue.zip}`;

    document.getElementById("next-directions").href =
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

},
    // --------------------------------------------------
    // Debug Helpers
    // --------------------------------------------------

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
    }

};
