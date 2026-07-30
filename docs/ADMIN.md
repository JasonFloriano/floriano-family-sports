# FFS – Floriano Family Sports
## Administrator Guide

Welcome to the FFS Admin Guide.

This website is powered by one Google Calendar and a small set of JSON files.

### Philosophy

- If information changes frequently, store it in **Google Calendar**.
- If information rarely changes, store it in a **JSON file**.
- Never duplicate information.
- Keep one source of truth for everything.

---

# Project Structure

```
FFS/
├── ADMIN.md
├── README.md
├── index.html
├── addison.html
├── ryley.html
├── css/
├── js/
├── data/
│   ├── athletes.json
│   ├── venues.json
│   ├── teams.json
│   └── opponents.json
└── assets/
```

---

# Source of Truth

| Information | Location |
|-------------|----------|
| Game Schedule | Google Calendar |
| Athlete Information | athletes.json |
| Venue Information | venues.json |
| Team Information | teams.json |
| Opponent Information | opponents.json |

---

# Adding a Game

Open Google Calendar.

Create a new event.

### Event Title

```
🏐 Addison • HOME vs Sonora
```

### Event Description

```
Athlete=Addison
VenueID=EHS
Facility=Gym
Opponent=SON
GameType=League
HomeAway=HOME
```

Save the event.

The website will update automatically.

---

# Adding a Tournament

Example:

Title

```
🤽 Ryley • Villa Park Classic
```

Description

```
Athlete=Ryley
VenueID=VILLA
Facility=Pool
GameType=Tournament
```

---

# Adding a New Athlete

Edit:

```
/data/athletes.json
```

Add a new athlete object.

---

# Adding a New Venue

Edit:

```
/data/venues.json
```

Each venue should contain:

- VenueID
- School
- Address
- Gym
- Pool

Only one record per school.

---

# Opponent Codes

| Code | School |
|------|--------|
| SON | Sonora |
| TROY | Troy |
| VAL | Valencia |
| ED | El Dorado |
| FOOT | Foothill |
| YL | Yorba Linda |
| ELT | El Toro |
| DB | Diamond Bar |
| SH | Sunny Hills |
| WB | Woodbridge |
| NW | Northwood |
| BO | Brea Olinda |
| PAC | Pacifica |
| ARL | Arlington |

---

# Venue Codes

Venue IDs should match the venue library.

Examples:

```
EHS
SON
TROY
VAL
ED
FOOT
YL
ELT
DB
SH
WB
NW
BO
PAC
ARL
VILLA
TUSTIN
```

---

# Do Not Edit

These files contain application logic.

```
js/app.js
js/calendar.js
```

Only edit them when adding new features.

For normal schedule updates, use Google Calendar and the JSON files.

---

# Architecture

```
Google Calendar
        │
        ▼
 calendar.js
        │
        ▼
Event Objects
        │
        ├──────────────┐
        ▼              ▼
athletes.json     venues.json
        │              │
        └──────┬───────┘
               ▼
         opponents.json
               │
               ▼
          Website Pages
```

---

# Design Goal

Keep FFS simple.

Update Google Calendar.

Commit changes to GitHub.

Everything else should work automatically.
