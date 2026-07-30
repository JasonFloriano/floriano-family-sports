// Floriano Family Sports (FFS)
// Main JavaScript

console.log("🏐 FFS Loaded");

async function loadVenues() {
    try {
        const response = await fetch("data/venues.json");
        const venues = await response.json();

        console.log("Venues Loaded:");
        console.table(venues);
    } catch (error) {
        console.error("Error loading venues:", error);
    }
}

loadVenues();
