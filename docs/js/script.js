// ==========================================
// Floriano Family Sports
// ==========================================

console.log("🏐 FFS Started");

const calendarURL =
    "https://calendar.google.com/calendar/ical/571551bd31f9314f7a0a70c01d74605b594b4bc6c5951d8d72657c53c268e6a1%40group.calendar.google.com/public/basic.ics";

async function loadJSON(file) {
    const response = await fetch(`data/${file}`);
    return await response.json();
}

async function loadData() {

    return {
        venues: await loadJSON("venues.json"),
        athletes: await loadJSON("athletes.json"),
        teams: await loadJSON("teams.json"),
        opponents: await loadJSON("opponents.json")
    };

}

async function initialize() {

    const data = await loadData();

    document.querySelector(".game-status").innerHTML =
        "🚀 FFS Ready";

    console.log(data);

}

initialize();
