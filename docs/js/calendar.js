async function testCalendarConnection() {

    const status = document.querySelector(".game-status");

    status.innerHTML = "📡 Connecting to Google Calendar...";

    try {

        const response = await fetch(
            "https://calendar.google.com/calendar/ical/571551bd31f9314f7a0a70c01d74605b594b4bc6c5951d8d72657c53c268e6a1%40group.calendar.google.com/public/basic.ics"
        );

        status.innerHTML =
            "✅ Connected!<br>Status: " + response.status;

    }

    catch(error){

        status.innerHTML =
            "❌ Calendar Blocked<br><small>" +
            error.message +
            "</small>";

    }

}

testCalendarConnection();
