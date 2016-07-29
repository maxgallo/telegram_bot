//const request = require('request');
const constants = require('../constants');
const Pokemon = require('../models/Pokemon');
const util = require('util');
const cloudscraper = require('cloudscraper');

function search(lat = constants.MY_HOUSE_LAT, lng = constants.MY_HOUSE_LNG){

    const url = constants.POKEVISION_URL.replace('LAT', lat).replace('LNG', lng);

    return new Promise( (resolve, reject) => {
        //request(url, function (error, response, body) {
        cloudscraper.get(url, function (error, response, body) {
            if (!error && response && response.statusCode == 200) {
                var parsedBody, pokemonArray = [];
                try {
                    parsedBody = JSON.parse(body);
                    if (parsedBody
                        && parsedBody.status === 'success'
                        && parsedBody.pokemon
                        && util.isArray(parsedBody.pokemon)
                    ){
                        //console.log(`---------------got ${parsedBody.pokemon.length} pokemons`);
                        resolve(parsedBody.pokemon.map( pokemonData => new Pokemon(pokemonData)));
                    } else {
                        reject('The format of the response wasn\'t correct.');
                    }
                } catch (err) {
                    reject('An error occurred while parsing the body response\n\n' + err);
                }

                if(parsedBody && parsedBody.status === 'success'){
                    resolve(parsedBody);
                }
            } else {
                reject('Http status: ' + response.statusCode);
            }
        })
    });
}

module.exports = search;
