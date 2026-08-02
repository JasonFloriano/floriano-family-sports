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