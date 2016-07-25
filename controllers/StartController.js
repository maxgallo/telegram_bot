const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const searchService = require('../services/searchService');
const filterService = require('../services/filterService');
const pokedex = require('../pokedex');

const constants = require('../constants');

class StartController extends TelegramBaseController {

    enableRadarHandler($){
        //setInterval( () => {
            searchService()
                .then( pokemonArray => filterService(pokemonArray) )
                .then( filteredPokemonArray => {
                    if( filteredPokemonArray && filteredPokemonArray.length) {
                        // found something
                        $.sendMessage(
                            filteredPokemonArray.reduce( (previous, current) => previous + ', ' + pokedex[current.id], 'I\'ve found: ')
                        );  
                        
                        filteredPokemonArray.map( pokemon => {
                            $.sendVenue({
                                title     : pokemon.name,
                                address   : 'not so usefull adress',
                                latitude  : constants.MY_HOUSE_LNG,
                                longitude : constants.MY_HOUSE_LAT,
                            });
                        })
                    } else {
                        // found nothing
                        $.sendMessage('not found anything');
                        $.sendVenue({
                            latitude: constants.MY_HOUSE_LNG,
                            longitude: constants.MY_HOUSE_LAT,
                        });
                    }
                })
                .catch( err => $.sendMessage(err.message));
        //}, 30 * 1000);
    }

    startHandler($){
        $.runMenu({
            message: 'Hey what do you wanna do?',
            layout: 2,
            '/search': () => {}, //will be on first line
            '/radar': () => {}, //will be on third line
        })
    }

    get routes() {
        return {
            'start' : 'startHandler',
            'radar' : 'enableRadarHandler'
        }

    }
}
module.exports = StartController;
