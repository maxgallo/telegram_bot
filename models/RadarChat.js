const util = require('util');

class RadarChat {
    constructor(id, intervalId) {
        this.id = ''+id;
        this.intervalId = intervalId;
        this.alreadyNotifiedPokemonIdArray = [];
    }

    addNotifiedPokemons(pokemonArray) {
        if(!util.isArray(pokemonArray)){
            return;
        }
        pokemonArray.map( pokemon => {
            this.alreadyNotifiedPokemonIdArray.push(pokemon.id);
        });
    }


}

module.exports = RadarChat;
