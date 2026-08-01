// dashboard.js

document.addEventListener("DOMContentLoaded", async () => {

    await FFS.init();

    FFS.renderNextGame();

    window.FFS = FFS;

});
