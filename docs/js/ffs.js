// ffs.js

const FFS = {

    data: null,

    async init() {

        this.data = await loadData();

        console.log("FFS Initialized");

        console.log(this.data);

    }

};
