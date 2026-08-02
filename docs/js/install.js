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

            alert(
`Install Floriano Family Sports

1. Tap Share

2. Tap Add to Home Screen`
            );

            return;

        }

        // iPhone Chrome
        if (isIPhoneChrome()) {

            alert(
`Open this website in Safari to install the app.`
            );

        }

    });

});