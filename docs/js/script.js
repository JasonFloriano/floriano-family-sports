console.log("🏐 FFS Started");

async function loadJSON(file) {
    const response = await fetch(`data/${file}`);
    return await response.json();
}

async function initialize() {

    try {

        const venues = await loadJSON("venues.json");
        const athletes = await loadJSON("athletes.json");
        const teams = await loadJSON("teams.json");
        const opponents = await loadJSON("opponents.json");

        document.getElementById("nextGameCard").innerHTML = `
            <h3>✅ Website Ready</h3>
            <p>${venues.length} Venues Loaded</p>
            <p>${athletes.length} Athletes Loaded</p>
            <p>${teams.length} Teams Loaded</p>
            <p>${opponents.length} Opponents Loaded</p>
        `;

    } catch (error) {

        document.getElementById("nextGameCard").innerHTML = `
            <h3>❌ Error Loading Data</h3>
            <p>${error}</p>
        `;

    }

}

initialize();
