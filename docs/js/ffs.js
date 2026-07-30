const FFS = { config:{
calendarId:“571551bd31f9314f7a0a70c01d74605b594b4bc6c5951d8d72657c53c268e6a1@group.calendar.google.com”,
apiKey:“AIzaSyCSUm0-2IIUX_bDPnqXUY6O0lBAbgeEFVc” },

data:null,

calendar:{ events:[], async load(config){ const
url=https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(config.calendarId)}/events?key=${config.apiKey}&singleEvents=true&orderBy=startTime;
const res=await fetch(url); if(!res.ok) throw new
Error(Calendar API ${res.status}); const json=await res.json();
this.events=(json.items||[]).map(e=>FFS.convertGoogleEvent(e)).filter(Boolean);
console.log(“📅 Calendar Loaded”,this.events); } },

async init(){ this.data=await loadData(); await
this.calendar.load(this.config); this.renderNextGame(); },

parseMetadata(description=““){ const meta={};
description.split(//).forEach(line=>{ const i=line.indexOf(”=“);
if(i>-1) meta[line.slice(0,i).trim()]=line.slice(i+1).trim(); }); return
meta; },

convertGoogleEvent(event){ const
m=this.parseMetadata(event.description||““); if(!m.ATHLETEID) return
null; const start=new Date(event.start.dateTime||event.start.date);
return { ATHLETEID:m.ATHLETEID, TEAMID:m.TEAMID, VENUEID:m.VENUEID,
OPPONENTID:m.OPPONENTID, FACILITY:m.FACILITY, TYPE:m.TYPE,
HOME:/HOME/i.test(event.summary||”“),
DATE:start.toLocaleDateString(”en-US”,{weekday:“long”,year:“numeric”,month:“long”,day:“numeric”}),
TIME:event.start.dateTime?start.toLocaleTimeString(“en-US”,{hour:“numeric”,minute:“2-digit”}):“TBD”
}; },

getAthlete(id){return this.data.athletes[id];}, getTeam(id){return
this.data.teams[id];}, getVenue(id){return this.data.venues[id];},
getOpponent(id){return this.data.opponents[id];},

getEventDetails(e){ return {…e, athlete:this.getAthlete(e.ATHLETEID),
team:this.getTeam(e.TEAMID), venue:this.getVenue(e.VENUEID),
opponent:this.getOpponent(e.OPPONENTID) }; },

getNextGame(){ if(!this.calendar.events.length) return null; return
this.getEventDetails(this.calendar.events[0]); },

renderNextGame(){ const game=this.getNextGame(); if(!game) return; const
school=game.opponent.school.replace(” High School”,““);
document.getElementById(”next-athlete”).textContent=🏐 ${game.athlete.name};
document.getElementById(“next-opponent”).textContent=game.HOME?🏠 HOME vs ${school} ${game.opponent.mascot}:🚌 AWAY @ ${school} ${game.opponent.mascot};
document.getElementById(“next-date”).textContent=📅 ${game.DATE};
document.getElementById(“next-time”).textContent=🕓 ${game.TIME};
document.getElementById(“next-venue”).textContent=📍 ${game.venue.name};
const
addr=${game.venue.address}, ${game.venue.city}, ${game.venue.state} ${game.venue.zip};
document.getElementById(“next-directions”).href=https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)};
} };

document.addEventListener(“DOMContentLoaded”,()=>FFS.init());
