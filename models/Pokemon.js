const pokedex = '../pokedex';

class Pokemon {
    constructor(data) {
        this.id             = data.pokemonId; // string
        this.name           = pokedex[this.id];
        this.isAlive        = data.is_alive;  // boolean
        this.latitude       = data.latitude;
        this.longitude      = data.longitude;
        this.expirationTime = data.expiration_time;
    }
}

module.exports = Pokemon;
