// ======================================================
// Floriano Family Sports (FFS)
// Core Data Engine v1.0
// ======================================================

const FFS = {

    // Loaded lookup data
    data: null,

    // --------------------------------------------------
    // Initialize
    // --------------------------------------------------

    async init() {

        this.data = await loadData();

        console.log("🏆 FFS Initialized");
        console.log(this.data);

    },

    // --------------------------------------------------
    // Athletes
    // --------------------------------------------------

    getAthlete(id) {
        return this.data.athletes[id];
    },

    // --------------------------------------------------
    // Teams
    // --------------------------------------------------

    getTeam(id) {
        return this.data.teams[id];
    },

    // --------------------------------------------------
    // Venues
    // --------------------------------------------------

    getVenue(id) {
        return this.data.venues[id];
    },

    // --------------------------------------------------
    // Opponents
    // --------------------------------------------------

    getOpponent(id) {
        return this.data.opponents[id];
    },

    // --------------------------------------------------
    // Build a Complete Event Object
    // --------------------------------------------------

    getEventDetails(event) {

        return {

            athlete: this.getAthlete(event.ATHLETEID),

            team: this.getTeam(event.TEAMID),

            venue: this.getVenue(event.VENUEID),

            opponent: this.getOpponent(event.OPPONENTID),

            facility: event.FACILITY,

            type: event.TYPE

        };

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
getNextGame() {

    const event = {

        ATHLETEID: "ADDISON",
        TEAMID: "EHS_FJV_VB",
        VENUEID: "EHS",
        OPPONENTID: "FULL",
        FACILITY: "GYM",
        TYPE: "LEAGUE",

        DATE: "August 13, 2026",

        TIME: "4:00 PM",

        HOME: true

    };

    return this.getEventDetails(event);

},
};
