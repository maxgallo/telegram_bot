const pokedex = require('../data/pokedex');

class Pokemon {
    constructor(data) {
        this.pokedexId      = ''+data.pokedexId; // string
        this.name           = pokedex[this.pokedexId];
        this.latitude       = data.latitude;
        this.longitude      = data.longitude;
        this.expirationTime = data.expires;
        this.id             = this.generateId();
    }

    generateId(){
        return '' + this.pokedexId + this.latitude + this.longitude;

    }

    getReadableExpiration(){
        var d = new Date(this.expirationTime * 1000);
        var hours = ("0" + d.getHours()).slice(-2);
        var mins  = ("0" + d.getMinutes()).slice(-2);
        return hours + ":" + mins;
    }

    isAlive(){
        return (this.expirationTime * 1000 - new Date().getTime() ) > 0;
    }

}

module.exports = Pokemon;
