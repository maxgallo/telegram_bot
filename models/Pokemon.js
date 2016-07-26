const pokedex = require('../data/pokedex');

class Pokemon {
    constructor(data) {
        this.id             = data.id;
        this.pokedexId      = data.pokemonId; // string
        this.name           = pokedex[this.pokedexId];
        this.isAlive        = data.is_alive;  // boolean
        this.latitude       = data.latitude;
        this.longitude      = data.longitude;
        this.expirationTime = data.expiration_time;
    }

    getReadableExpiration(){
        var d = new Date(this.expirationTime * 1000);
        var hours = ("0" + d.getHours()).slice(-2);
        var mins  = ("0" + d.getMinutes()).slice(-2);
        return hours + ":" + mins;
    }
}

module.exports = Pokemon;
