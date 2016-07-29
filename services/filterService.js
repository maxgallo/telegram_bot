const pokemonWhiteList = require('../data/white-list');
const util = require('util');

function whiteList(pokemonArray) {
    return pokemonArray.filter(function(pokemon){
        if (
            pokemon.isAlive
            && !!pokemonWhiteList[pokemon.pokedexId]
        ) {
            return true;
        }
        return false;
    });
}

function alreadyNotified(pokemonArray, chat) {
    if(!chat) {
        return pokemonArray;
    }
    return pokemonArray.filter( pokemon => {
        return chat.alreadyNotifiedPokemonIdArray.indexOf(pokemon.id) === -1;
    });
}

function duplicates(pokemonArrayToFilter) {
    const pokemonArray = pokemonArrayToFilter.slice();
    //console.log('pre duplicates: ', pokemonArray.reduce( (prev, curr) => prev + ', ' + curr.latitude,''));

    const filteredArray = [];
    let index = 0;
    while ( index < pokemonArray.length ) {
        const pokemon = pokemonArray[index];
        if(index === 0){
            filteredArray.push(pokemon);
            index++;
            continue;
        }
        var isDuplicate = false;
        for ( var i in filteredArray){
            let poke = filteredArray[i];
            if( poke.pokedexId === pokemon.pokedexId
                && poke.latitude === pokemon.latitude
                && poke.longitude === pokemon.longitude
            ) {
                isDuplicate = true;
                break;
            }
        }
        if(!isDuplicate) {
            filteredArray.push(pokemon);
        }
        index++;
    }

    //console.log('post duplicates: ', filteredArray.reduce( (prev, curr) => prev + ', ' + curr.latitude,''));
    return filteredArray;
}

module.exports = {
    whiteList,
    alreadyNotified,
    duplicates
};




