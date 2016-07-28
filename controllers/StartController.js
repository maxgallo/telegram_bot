const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const searchService = require('../services/searchService');
const filterService = require('../services/filterService');
const pokedex = require('../data/pokedex');
const constants = require('../constants');
const RadarChat = require('../models/RadarChat');

const util = require('util');

class StartController extends TelegramBaseController {
    constructor() {
        super();

        this.radarChatSet = {};
        this.chatIdIntervals = {};
    }

    storeNotifiedPokemons(chatId, filteredPokemonArray){
        const chat = this.radarChatSet[chatId];
        if(chat) {
            chat.addNotifiedPokemons(filteredPokemonArray);
        }
    }

    sendAvailablePokemonMessage($, filteredPokemonArray, showNotFound){
        const chatId = $.chatId;
        if( filteredPokemonArray && filteredPokemonArray.length) {
            // found something
            $.sendMessage(
                `Hey, I found ${filteredPokemonArray.length} pokemon${filteredPokemonArray.length > 1 ? 's' : ''}`
                + `: ${filteredPokemonArray.reduce( (current, next) => current + ' ' + next.name + ',' , '').slice(0,-1)}`
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
                //$.sendPhoto({ url: 'URL', filename: 'http://i3.kym-cdn.com/entries/icons/original/000/018/682/obi-wan.jpg'});
            }
        }
    }


    filter(pokemonArray, chatId){
        if(!pokemonArray || !util.isArray(pokemonArray) || !pokemonArray.length){
            return [];
        }
        let filteredArray = filterService.whiteList(pokemonArray);
        if( !filteredArray.length) { return [] };

        const filteredArrayDuplicate = filteredArray.slice();

        //console.log('pre already notified: ', filteredArray.length);
        filteredArray     = filterService.alreadyNotified(filteredArray, this.radarChatSet[chatId]);
        if( !filteredArray.length) { return [] };

        //console.log('pre duplicates: ', filteredArray.length);
        filteredArray     = filterService.duplicates(filteredArray);

        //console.log('post duplicates: ', filteredArray.length);
        this.storeNotifiedPokemons(chatId, filteredArrayDuplicate);

        //console.log('2 - post duplicates: ', filteredArray.length);
        return Promise.resolve(filteredArray);
    }

    scan($, showNotFound = false) {
        $.sendChatAction('find_location');
        return searchService()
            .then(
                pokemonArray => this.filter(pokemonArray, $.chatId),
                err => { throw(err)}
            )
            .then(
                filteredPokemonArray => this.sendAvailablePokemonMessage($, filteredPokemonArray, showNotFound),
                err => { throw(err)}
            )
            .catch( err => {
                console.log(err);
                /* $.sendMessage(err) */
            });
    }

    simpleScanHandler($){
        $.sendMessage('Let\'s do a simple scan...');
        this.scan($, true);
    }


    enableRadarHandler($) {
        const chatId = $.chatId;
        if(!!this.radarChatSet[chatId]) {
            $.sendMessage('Your radar is already enabled')
        } else {
            $.sendMessage('Radar mode is now Enabled')
            // perform a simple scan immediately
            this.scan($, true);
            // set interval for future scans
            const intervalId = setInterval( () => this.scan($), constants.SCAN_FREQUENCY);
            this.radarChatSet[chatId] = new RadarChat(chatId, intervalId);
        }
    }

    disableRadarHandler($) {
        const chat = this.radarChatSet[$.chatId];
        if(!chat) {
            $.sendMessage('You radar was already Disabled')
        } else {
            try {
                clearInterval(chat.intervalId);
            } catch(e) {}
            $.sendMessage('Radar mode is now Disabled');
            delete this.radarChatSet[$.chatId];
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
