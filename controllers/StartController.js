const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const searchService = require('../services/searchService');
const filterService = require('../services/filterService');
const pokedex = require('../data/pokedex');
const constants = require('../constants');

class StartController extends TelegramBaseController {
    constructor() {
        super();

        this.chatIdIntervals = {};
    }

    sendAvailablePokemonMessage($, filteredPokemonArray, showNotFound){
        if( filteredPokemonArray && filteredPokemonArray.length) {
            // found something
            $.sendMessage(
                `Hey, I found ${filteredPokemon.length} pokemon${filteredPokemon.length > 1 ? 's' : ''}`
            );
            setTimeout( () => {
                filteredPokemonArray.map( pokemon => {
                    $.sendVenue(
                        pokemon.latitude,
                        pokemon.longitude,
                        pokemon.name,
                        'Expires at: ' + pokemon.getReadableExpiration()
                    )
                })
            }, 100);
        } else {
            // found nothing
            if (showNotFound) {
                $.sendMessage('I\'m sorry, these aren\'t the Pokémons you\'re looking for.');
                $.sendPhoto({ url: 'URL', filename: 'http://i3.kym-cdn.com/entries/icons/original/000/018/682/obi-wan.jpg'});
            }
        }
    }

    scan($, showNotFound = false) {
        $.sendChatAction('find_location');
        return searchService()
            .then(
                pokemonArray => filterService(pokemonArray),
                err => { throw(err)}
            )
            .then(
                filteredPokemonArray => this.sendAvailablePokemonMessage($, filteredPokemonArray, showNotFound),
                err => { throw(err)}
            )
            .catch( err => { /* $.sendMessage(err) */ });
    }

    simpleScanHandler($){
        $.sendMessage('I\'m performing a simple scan for you...');
        this.scan($, true);
    }


    enableRadarHandler($) {
        const chatId = $.chatId;
        if(!!this.chatIdIntervals[chatId]) {
            $.sendMessage('Your radar is already enabled')
        } else {
            $.sendMessage('Radar mode is now Enabled')
            // perform a simple scan immediately
            this.scan($);
            // set interval for future scans
            this.chatIdIntervals[chatId] = setInterval( () => this.scan($), constants.SCAN_FREQUENCY);
        }
    }

    disableRadarHandler($) {
        const chatId = $.chatId;
        if(!this.chatIdIntervals[chatId]) {
            $.sendMessage('You radar was already Disabled')
        } else {
            try {
                clearInterval(this.chatIdIntervals[chatId]);
            } catch(e) {}
            $.sendMessage('Radar mode is now Disabled');
            delete this.chatIdIntervals[chatId];
        }

    }

    startHandler($){
        $.runMenu({
            message: 'Hey what do you wanna do?',
            [constants.route.ENABLE_RADAR] : () => {},
            [constants.route.DISABLE_RADAR]: () => {},
            [constants.route.SIMPLE_SCAN]: () => {},
            'anyMatch': () => { //will be executed at any other message

            }
        })
    }

    get routes() {
        return {
            [constants.route.START] : 'startHandler',
            [constants.route.ENABLE_RADAR]: 'enableRadarHandler',
            [constants.route.DISABLE_RADAR]:'disableRadarHandler',
            [constants.route.SIMPLE_SCAN]:'simpleScanHandler'
        }

    }
}
module.exports = StartController;
