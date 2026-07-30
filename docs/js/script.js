// ========================================
// Floriano Family Sports
// ========================================

console.log("🏐 FFS Started");

async function loadJSON(file) {
    const response = await fetch(`data/${file}`);
    return await response.json();
}

async function initialize() {

    const venues = await loadJSON("venues.json");
    const athletes = await loadJSON("athletes.json");
    const teams = await loadJSON("teams.json");
    const opponents = await loadJSON("opponents.json");

    console.log("Venues", venues);
    console.log("Athletes", athletes);
    console.log("Teams", teams);
    console.log("Opponents", opponents);

}

initialize();
