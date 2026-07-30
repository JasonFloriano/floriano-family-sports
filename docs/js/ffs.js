// ======================================================
// Floriano Family Sports (FFS)
// Core Data Engine
// ======================================================

const FFS = {

    data: null,

    // Initialize FFS
    async init() {

        this.data = await loadData();

        console.log("🏆 FFS Initialized");
        console.log(this.data);

    },

    // -----------------------------
    // Athletes
    // -----------------------------

    getAthlete(id) {
        return this.data.athletes[id];
    },

    // -----------------------------
    // Teams
    // -----------------------------

    getTeam(id) {
        return this.data.teams[id];
    },

    // -----------------------------
    // Venues
    // -----------------------------

    getVenue(id) {
        return this.data.venues[id];
    },

    // -----------------------------
    // Opponents
    // -----------------------------

    getOpponent(id) {
        return this.data.opponents[id];
    },

    // -----------------------------
    // Debug Helpers
    // -----------------------------

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
