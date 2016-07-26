const whiteList = require('../data/white-list');
const util = require('util');

function filter(pokemonArray) {
    return filteredPokemon  = pokemonArray.filter(function(pokemon){
        if (
            pokemon.isAlive
            && !!whiteList[pokemon.pokedexId]
        ) {
            return true;
        }
        return false;
    });
}

module.exports = filter;




