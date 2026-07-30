// ==========================================
// Floriano Family Sports (FFS)
// Main Application
// ==========================================

console.log("🏐 FFS starting...");

async function loadData(fileName) {
    const response = await fetch(`data/${fileName}`);
    return await response.json();
}

async function initializeFFS() {
    try {
        const venues = await loadData("venues.json");
        const athletes = await loadData("athletes.json");
        const opponents = await loadData("opponents.json");
        const teams = await loadData("teams.json");

        console.log("✅ FFS Loaded Successfully");

        console.table(venues);
        console.table(athletes);
        console.table(opponents);
        console.table(teams);

    } catch (error) {
        console.error("FFS Error:", error);
    }
}

initializeFFS();
