async function testCalendarConnection() {

    try {

        const response = await fetch(
            "https://calendar.google.com/calendar/ical/571551bd31f9314f7a0a70c01d74605b594b4bc6c5951d8d72657c53c268e6a1%40group.calendar.google.com/public/basic.ics"
        );

        console.log("Calendar Status:", response.status);

    } catch (error) {

        console.log("Calendar Error:", error);

    }

}

testCalendarConnection();
