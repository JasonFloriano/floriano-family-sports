// ======================================================
// Floriano Family Sports (FFS)
// Core Data Engine v3.2.0
// =======================================================
// FIXES:
// • All-day Google Calendar dates no longer shift backward
// • Multi-day all-day events display their full date range
// • Timed events continue using their real start time
// • TBD time logic preserved
// • Existing FFS metadata structure preserved
// =======================================================

const FFS = {

    config: {
        calendarId: "571551bd31f9314f7a0a70c01d74605b594b4bc6c5951d8d72657c53c268e6a1@group.calendar.google.com",
        apiKey: "AIzaSyCSUm0-2IIUX_bDPnqXUY6O0lBAbgeEFVc"
    },

    data: null,

    // ==================================================
    // CALENDAR
    // ==================================================

    calendar: {

        events: [],

        async load(config) {

            const url =
                `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(config.calendarId)}/events` +
                `?key=${config.apiKey}` +
                `&singleEvents=true` +
                `&orderBy=startTime`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Calendar API Error: ${response.status}`);
            }

            const json = await response.json();

            this.events = (json.items || [])
                .map(event => FFS.convertGoogleEvent(event))
                .filter(Boolean);

            console.log("📅 Calendar Loaded");
            console.table(this.events);
        }
    },

    // ==================================================
    // INITIALIZATION
    // ==================================================

    async init() {

        this.data = await loadData();

        console.log("FFS Data:", this.data);

        await this.calendar.load(this.config);

        console.log("🏆 FFS Initialized");

        // this.renderNextGame();
    },

    // ==================================================
    // METADATA PARSER
    // ==================================================

    parseMetadata(description = "") {

        const meta = {};

        description.split(/\r?\n/).forEach(line => {

            const i = line.indexOf("=");

            if (i > -1) {

                meta[line.slice(0, i).trim()] =
                    line.slice(i + 1).trim();

            }

        });

        return meta;
    },

    // ==================================================
    // GOOGLE ALL-DAY DATE PARSER
    // ==================================================
    // IMPORTANT:
    //
    // Google Calendar returns all-day dates as:
    //
    //     "2026-09-04"
    //
    // DO NOT use:
    //
    //     new Date("2026-09-04")
    //
    // because JavaScript treats that as UTC midnight.
    //
    // Instead, construct the date using local year/month/day.
    // This prevents California from seeing the previous day.
    // ==================================================

    parseAllDayDate(dateString) {

        if (!dateString) return null;

        const parts = dateString.split("-");

        if (parts.length !== 3) return null;

        const year = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);

        if (
            !Number.isFinite(year) ||
            !Number.isFinite(month) ||
            !Number.isFinite(day)
        ) {
            return null;
        }

        return new Date(
            year,
            month - 1,
            day
        );
    },

    // ==================================================
    // ADD DAYS — LOCAL TIME SAFE
    // ==================================================

    addDays(date, days) {

        const result = new Date(date);

        result.setDate(
            result.getDate() + days
        );

        return result;
    },

    // ==================================================
    // FORMAT LONG DATE
    // ==================================================

    formatLongDate(date) {

        if (!date) return "";

        return date.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );
    },

    // ==================================================
    // FORMAT SHORT DATE
    // ==================================================

    formatShortDate(date) {

        if (!date) return "";

        return date.toLocaleDateString(
            "en-US",
            {
                weekday: "short",
                month: "short",
                day: "numeric"
            }
        );
    },

    // ==================================================
    // FORMAT DATE RANGE
    // ==================================================
    // Google Calendar's all-day END date is exclusive.
    //
    // Example:
    //
    // start = Sep 4
    // end   = Sep 6
    //
    // Actual event:
    //
    // Sep 4 – Sep 5
    //
    // So we subtract one day from the API end date.
    // ==================================================

    formatDateRange(start, end, short = false) {

        if (!start) return "";

        if (!end) {

            return short
                ? this.formatShortDate(start)
                : this.formatLongDate(start);

        }

        const actualEnd = this.addDays(end, -1);

        // Same calendar day
        if (
            start.getFullYear() === actualEnd.getFullYear() &&
            start.getMonth() === actualEnd.getMonth() &&
            start.getDate() === actualEnd.getDate()
        ) {

            return short
                ? this.formatShortDate(start)
                : this.formatLongDate(start);
        }

        if (short) {

            return `${this.formatShortDate(start)} – ${this.formatShortDate(actualEnd)}`;

        }

        return `${this.formatLongDate(start)} – ${this.formatLongDate(actualEnd)}`;
    },

    // ==================================================
    // GOOGLE EVENT CONVERTER
    // ==================================================

    convertGoogleEvent(event) {

        const meta =
            this.parseMetadata(
                event.description || ""
            );

        // Ignore calendar events that aren't FFS events
        if (!meta.ATHLETEID) {
            return null;
        }

        // ------------------------------------------------
        // TIMED EVENT
        // ------------------------------------------------

        const isTimedEvent =
            !!event.start?.dateTime;

        // ------------------------------------------------
        // ALL-DAY EVENT
        // ------------------------------------------------

        const isAllDayEvent =
            !!event.start?.date;

        let start;
        let end = null;

        if (isTimedEvent) {

            start =
                new Date(event.start.dateTime);

            if (event.end?.dateTime) {

                end =
                    new Date(event.end.dateTime);

            }

        } else if (isAllDayEvent) {

            // CRITICAL FIX:
            // Parse Google date as LOCAL calendar date.
            start =
                this.parseAllDayDate(
                    event.start.date
                );

            if (event.end?.date) {

                end =
                    this.parseAllDayDate(
                        event.end.date
                    );

            }

        } else {

            return null;
        }

        if (!start || Number.isNaN(start.getTime())) {

            console.warn(
                "FFS: Invalid event start date",
                event
            );

            return null;
        }

        // ------------------------------------------------
        // DISPLAY DATE
        // ------------------------------------------------

        const dateDisplay =
            isAllDayEvent
                ? this.formatDateRange(
                    start,
                    end,
                    false
                )
                : this.formatLongDate(start);

        const shortDateDisplay =
            isAllDayEvent
                ? this.formatDateRange(
                    start,
                    end,
                    true
                )
                : this.formatShortDate(start);

        // ------------------------------------------------
        // RETURN NORMALIZED EVENT
        // ------------------------------------------------

        return {

            // --------------------------------------------
            // FFS METADATA
            // --------------------------------------------

            ATHLETEID:
                meta.ATHLETEID,

            TEAMID:
                meta.TEAMID,

            VENUEID:
                meta.VENUEID,

            OPPONENTID:
                meta.OPPONENTID,

            FACILITY:
                meta.FACILITY,

            TYPE:
                meta.TYPE,

            // --------------------------------------------
            // GOOGLE DATA
            // --------------------------------------------

            summary:
                event.summary || "",

            description:
                event.description || "",

            location:
                event.location || "",

            // --------------------------------------------
            // EVENT TYPE
            // --------------------------------------------

            isAllDay:
                isAllDayEvent,

            isTimed:
                isTimedEvent,

            // --------------------------------------------
            // RAW DATES
            // --------------------------------------------

            start:
                start,

            end:
                end,

            // --------------------------------------------
            // DISPLAY DATES
            // --------------------------------------------

            DATE:
                dateDisplay,

            shortDate:
                shortDateDisplay,

            // --------------------------------------------
            // TIME
            // --------------------------------------------

            TIME:
                isTimedEvent
                    ? start.toLocaleTimeString(
                        "en-US",
                        {
                            hour: "numeric",
                            minute: "2-digit"
                        }
                    )
                    : "TBD",

            // --------------------------------------------
            // HOME / AWAY
            // --------------------------------------------

            HOME:
                /HOME/i.test(
                    event.summary || ""
                )
        };
    },

    // ==================================================
    // ATHLETE
    // ==================================================

    getAthlete(id) {

        return this.data.athletes[id];

    },

    // ==================================================
    // TEAM
    // ==================================================

    getTeam(id) {

        return this.data.teams[id];

    },

    // ==================================================
    // VENUE
    // ==================================================

    getVenue(id) {

        return this.data.venues[id];

    },

    // ==================================================
    // OPPONENT
    // ==================================================

    getOpponent(id) {

        return this.data.opponents[id];

    },

    // ==================================================
    // EVENT DETAILS
    // ==================================================

    getEventDetails(event) {

        const athlete =
            this.getAthlete(
                event.ATHLETEID
            );

        const team =
            this.getTeam(
                event.TEAMID
            );

        const venue =
            this.getVenue(
                event.VENUEID
            );

        const opponent =
            this.getOpponent(
                event.OPPONENTID
            );

        return {

            ...event,

            athlete,

            team,

            venue,

            opponent,

            display: {

                // ----------------------------------------
                // ATHLETE
                // ----------------------------------------

                athlete:
                    athlete?.name || "",

                // ----------------------------------------
                // OPPONENT
                // ----------------------------------------

                opponent:

                    opponent

                        ? `${opponent.school}${opponent.mascot
                            ? ` • ${opponent.mascot}`
                            : ""
                        }`

                        : event.TYPE,

                // ----------------------------------------
                // VENUE
                // ----------------------------------------

                venue:
                    venue
                        ? venue.name
                        : "",

                // ----------------------------------------
                // BADGE
                // ----------------------------------------

                badge:
                    event.TYPE,

                // ----------------------------------------
                // HOME / AWAY
                // ----------------------------------------

                homeAway:

                    event.HOME
                        ? "HOME"
                        : "AWAY",

                // ----------------------------------------
                // DATE
                // ----------------------------------------
                // IMPORTANT:
                // Use the already-correct date generated
                // by convertGoogleEvent().
                // ----------------------------------------

                shortDate:
                    event.shortDate,

                // ----------------------------------------
                // DIRECTIONS
                // ----------------------------------------

                directions:

                    venue

                        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${venue.address}, ${venue.city}, ${venue.state} ${venue.zip}`
                        )}`

                        : "",

                // ----------------------------------------
                // ACCENT
                // ----------------------------------------

                accent:

                    event.ATHLETEID === "ADDISON"
                        ? "addison"
                        : "ryley"
            }
        };
    },

    // ==================================================
    // NEXT GAME
    // ==================================================
    //
    // GAME WINDOW:
    // A timed game remains the active "Next Game"
    // for 75 minutes after its scheduled start.
    //
    // After 75 minutes, FFS moves to the next
    // chronological game.
    //
    // Future games are always eligible.
    // ==================================================

    getNextGame() {

        const now = new Date();

        // Keep a game active for 75 minutes
        // after its scheduled start time.
        const GAME_DISPLAY_WINDOW = 75 * 60 * 1000;

        const games = this.calendar.events
            .filter(event => {

                // Only League and Tournament games
                if (
                    !["LEAGUE", "TOURNAMENT"]
                        .includes(event.TYPE)
                ) {
                    return false;
                }

                // Next Game only uses timed games
                if (!event.isTimed) {
                    return false;
                }

                // Must have a valid start time
                if (
                    !(event.start instanceof Date) ||
                    Number.isNaN(event.start.getTime())
                ) {
                    return false;
                }

                // Positive = game has started
                // Negative = game is in the future
                const elapsed =
                    now.getTime() -
                    event.start.getTime();

                // Include future games and games
                // that started less than 75 minutes ago.
                return elapsed < GAME_DISPLAY_WINDOW;
            })

            // Always choose the earliest game
            .sort(
                (a, b) =>
                    a.start.getTime() -
                    b.start.getTime()
            );

        const event = games[0];

        if (!event) {
            return null;
        }

        return this.getEventDetails(event);
    },

    // ==================================================
    // TODAY'S EVENTS
    // ==================================================

    getTodaysEvents() {

        const today =
            new Date();

        return this.calendar.events

            .filter(event => {

                return (
                    event.start.getFullYear()
                    ===
                    today.getFullYear()

                    &&

                    event.start.getMonth()
                    ===
                    today.getMonth()

                    &&

                    event.start.getDate()
                    ===
                    today.getDate()
                );

            })

            .sort(
                (a, b) =>
                    a.start - b.start
            )

            .map(
                event =>
                    this.getEventDetails(event)
            );
    },

    // ==================================================
    // ATHLETE SCHEDULE
    // ==================================================

    getAthleteSchedule(athleteId) {

        return this.getUpcomingEvents()

            .filter(
                event =>
                    event.ATHLETEID === athleteId
            );
    },

    // ==================================================
    // EVENTS BY TYPE
    // ==================================================

    getEventsByType(type) {

        return this.getUpcomingEvents()

            .filter(
                event =>
                    event.TYPE === type
            );
    },

    // ==================================================
    // RENDER NEXT GAME
    // ==================================================

    renderNextGame() {

        const game =
            this.getNextGame();

        if (!game) {

            console.warn(
                "No upcoming games found."
            );

            return;
        }

        if (
            !game.opponent ||
            !game.venue
        ) {

            console.warn(
                "Incomplete event",
                game
            );

            return;
        }

        const school =
            (
                game.opponent.school || ""
            ).replace(
                " High School",
                ""
            );

        document.getElementById(
            "next-athlete"
        ).textContent =
            `🏐 ${game.athlete.name}`;

        document.getElementById(
            "next-opponent"
        ).textContent =

            game.HOME

                ? `🏠 HOME vs ${school} ${game.opponent.mascot}`

                : `🚌 AWAY @ ${school} ${game.opponent.mascot}`;

        document.getElementById(
            "next-date"
        ).textContent =
            `📅 ${game.DATE}`;

        document.getElementById(
            "next-time"
        ).textContent =
            `🕓 ${game.TIME}`;

        document.getElementById(
            "next-venue"
        ).textContent =
            `📍 ${game.venue.name}`;

        const address =
            `${game.venue.address}, ${game.venue.city}, ${game.venue.state} ${game.venue.zip}`;

        document.getElementById(
            "next-directions"
        ).href =
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    },

    // ==================================================
    // DEBUG / CALENDAR VIEW
    // ==================================================

    showCalendar() {

        console.table(
            this.calendar.events
        );

    }

};