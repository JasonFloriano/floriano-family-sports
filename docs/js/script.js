// script.js

async function loadJSON(file) {
  const response = await fetch(file);

  if (!response.ok) {
    throw new Error(`Failed to load ${file}`);
  }

  return response.json();
}

async function loadData() {
  try {
    const data = {
      athletes: await loadJSON("data/athletes.json"),
      teams: await loadJSON("data/teams.json"),
      venues: await loadJSON("data/venues.json"),
      opponents: await loadJSON("data/opponents.json")
    };

    console.log("FFS Data Loaded");
    console.log(data);

    return data;

  } catch (error) {
    console.error("Error loading data:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {

  const data = await loadData();

  // Calendar integration goes here

});
