// =========================================
// FFS Smart Install
// =========================================

let deferredPrompt = null;

// Android install prompt
window.addEventListener("beforeinstallprompt", (event) => {

    event.preventDefault();
    deferredPrompt = event;

});

// Detect if running as an installed app
function isInstalled() {

    return window.matchMedia("(display-mode: standalone)").matches
        || window.navigator.standalone === true;

}

// Detect iPhone / iPad
function isIOS() {

    return /iPhone|iPad|iPod/.test(navigator.userAgent);

}

// Detect Android
function isAndroid() {

    return /Android/.test(navigator.userAgent);

}

// =========================================
// Install Button
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    const button = document.getElementById("installButton");

    if (!button) return;

    const modal = document.getElementById("installModal");
    const message = document.getElementById("installMessage");
    const instructions = document.getElementById("installInstructions");

    function showInstallModal(title, html) {

        message.innerHTML = title;
        instructions.innerHTML = html;

        modal.classList.add("show");

    }

    function closeInstallModal() {

        modal.classList.remove("show");

    }

    document
        .getElementById("closeInstallModal")
        .addEventListener("click", closeInstallModal);

    document
        .getElementById("installOkay")
        .addEventListener("click", closeInstallModal);

    // Hide install button if already installed
    if (isInstalled()) {

        button.style.display = "none";
        return;

    }

    button.addEventListener("click", () => {

        // Android native install prompt
        if (deferredPrompt) {

            deferredPrompt.prompt();
            return;

        }

        // iPhone / iPad instructions
        if (isIOS()) {

            showInstallModal(

                "Install Floriano Family Sports",

                `
                <p>
                    Add FFS to your Home Screen for one-tap access.
                </p>

                <ol>

                    <li>Tap the <strong>Share</strong> button.</li>

                    <li>Select <strong>Add to Home Screen</strong>.</li>

                </ol>

                `

            );

            return;

        }

        // Fallback for unsupported browsers/devices
        showInstallModal(

            "Installation",

            `
            <p>

                Installation isn't available on this browser.

            </p>
            `

        );

    });

});