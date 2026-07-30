// ffs.js

const FFS = {

    data: null,

    async init() {

        this.data = await loadData();

        console.log("FFS Initialized");

        console.log(this.data);

    }

};
getAthlete(id) {

    return this.data.athletes[id];

},

getTeam(id) {

    return this.data.teams[id];

},

getVenue(id) {

    return this.data.venues[id];

},

getOpponent(id) {

    return this.data.opponents[id];

}
