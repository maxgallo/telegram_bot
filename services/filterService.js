const whiteList = require('../white-list');
const util = require('util');

function filter(pokemonArray) {
    return filteredPokemon  = pokemonArray.filter(function(pokemon){
        return pokemon.isAlive && !!whiteList[pokemon.id];
    });
}

module.exports = filter;




