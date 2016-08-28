const request = require('request');
const constants = require('../constants');
const Pokemon = require('../models/Pokemon');
const util = require('util');
const cloudscraper = require('cloudscraper');

const execSync = require('child_process').execSync;

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


function searchWithCurl(uselessData, callback){
    var data = execSync("curl '" + constants.SKIPLAGGED_URL + "' -H 'Referer: https://skiplagged.com/catch-that/'");
    if(data){
        callback(null, {statusCode:200}, data);
    } else {
        callback('Some error during CURL request', {statusCode:200}, {});
    }
}


function skiplaggedSearch(lat = constants.MY_HOUSE_LAT, lng = constants.MY_HOUSE_LNG){
    //const url = constants.SKIPLAGGED_URL;
    const requestData = {
        url     : constants.SKIPLAGGED_URL,
        headers : {
            'Referer' : 'https://skiplagged.com/catch-that/'
        }
    }

    return new Promise( (resolve, reject) => {
        searchWithCurl( false, function(error, response, body) {
        //request(requestData, function (error, response, body) {
        //cloudscraper.get(requestData, function (error, response, body) {
            if (!error && response && response.statusCode == 200) {
                var parsedBody, pokemonArray = [];
                try {
                    parsedBody = JSON.parse(body);
                    if (parsedBody
                        && parsedBody.pokemons
                        && util.isArray(parsedBody.pokemons)
                    ){
                        console.log(`---------------got ${parsedBody.pokemons.length} pokemons`);
                        const pokemonArray = parsedBody.pokemons.map( pokemonData => new Pokemon({
                            pokedexId : pokemonData.pokemon_id,
                            latitude  : pokemonData.latitude,
                            longitude : pokemonData.longitude,
                            expires   : pokemonData.expires
                        }));
                        resolve(pokemonArray);
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
                reject('Error' + JSON.stringify(error));
            }
        })
    });
}








module.exports = skiplaggedSearch;
