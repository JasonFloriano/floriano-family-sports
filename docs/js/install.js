// =========================================
// FFS Smart Install
// =========================================

let deferredPrompt = null;

// Android / Chrome install prompt
window.addEventListener("beforeinstallprompt", (event) => {

    event.preventDefault();

    deferredPrompt = event;

});

// Detect if running as an installed app
function isInstalled() {

    return window.matchMedia("(display-mode: standalone)").matches
        || window.navigator.standalone === true;

}

// iPhone Safari
function isIPhoneSafari() {

    const ua = navigator.userAgent;

    return /iPhone|iPad|iPod/.test(ua)
        && /Safari/.test(ua)
        && !/CriOS/.test(ua);

}

// iPhone Chrome
function isIPhoneChrome() {

    return /CriOS/.test(navigator.userAgent);

}

// Android
function isAndroid() {

    return /Android/.test(navigator.userAgent);

} 
// =========================================
// Install Button
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    const button =
        document.getElementById("installButton");

    if (!button) return;
    
    const modal = document.getElementById("installModal");
const message = document.getElementById("installMessage");
const instructions = document.getElementById("installInstructions");

function showInstallModal(title, html) {

    message.innerHTML = title;
    instructions.innerHTML = html;

    modal.classList.add("show");

}

document
.getElementById("closeInstallModal")
.addEventListener("click", () => {

    modal.classList.remove("show");

});

document
.getElementById("installOkay")
.addEventListener("click", () => {

    modal.classList.remove("show");

});

// Hide if already installed
if (isInstalled()) {

    button.style.display = "none";
    return;

}

    // Hide if already installed
    if (isInstalled()) {

        button.style.display = "none";
        return;

    }

    button.addEventListener("click", () => {

        // Android
        if (deferredPrompt) {

            deferredPrompt.prompt();
            return;

        }

        // iPhone Safari
        if (isIPhoneSafari()) {

            showInstallModal(

"Install Floriano Family Sports",

`
<ol>

<li>Tap the <strong>Share</strong> button.</li>

<li>Tap <strong>Add to Home Screen</strong>.</li>

</ol>

`

);

            return;

        }

        // iPhone Chrome
        if (isIPhoneChrome()) {

            showInstallModal(

"Installation requires Safari",

`
<p>

Apple only allows Home Screen installation
from Safari.

</p>

`

);

        }

    });

});