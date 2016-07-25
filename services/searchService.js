const request = require('request');
const constants = require('../constants');
const Pokemon = require('../models/Pokemon');
const util = require('util');

function search(lat = constants.MY_HOUSE_LAT, lng = constants.MY_HOUSE_LNG){

    const url = constants.POKEVISION_URL.replace('LAT', lat).replace('LNG', lng);

    return new Promise( (resolve, reject) => {
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var parsedBody, pokemonArray = [];
                try {
                    parsedBody = JSON.parse(body);
                    if (parsedBody
                        && parsedBody.status === 'success'
                        && parsedBody.pokemon
                        && util.isArray(parsedBody.pokemon)
                    ){
                        resolve(parsedBody.pokemon.map( pokemonData => new Pokemon(pokemonData)));
                    } else {
                        throw('The format of the response wasn\'t correct.');
                    }
                } catch (err) {
                    throw('An error occurred while parsing the body response');
                }

                if(parsedBody && parsedBody.status === 'success'){
                    resolve(parsedBody);
                }
            } else {
                throw new Error('The server did not respond in time');
            }
        })
    });
}

module.exports = search;
