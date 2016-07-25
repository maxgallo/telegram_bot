'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const tg = new Telegram.Telegram('238717881:AAENx7Nu2Xrla9qNHd8HVrcg8Y26esqd-zc')


var request = require('request');
const url = 'https://pokevision.com/map/data/51.5106922693391/-0.12089252471923827';

const pokedex = require('./pokedex.js');
const whiteList = require('./white-list.js');

class PingController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    pingHandler($) {
        $.sendMessage('pong')
    }

    get routes() {
        return {
            'ping': 'pingHandler'
        }
    }
}



class SearchController extends TelegramBaseController {

    searchHandler($){
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                
                var parsedBody;
                try {
                    parsedBody = JSON.parse(body);
                } catch (err) {
                    $.sendMessage('An error occurred while parsing the body response');
                }

                if(parsedBody.status === 'success'){
                    var good  = parsedBody.pokemon.filter(function(pokemon){
                        return !!whiteList[pokemon.pokemonId];
                    });

                    if(good.length) {
                        $.sendMessage(good.reduce( (previous, current) => previous + ', ' + pokedex[current.pokemonId], 'I\'ve found: '));
                    } else {
                        $.sendMessage('I haven\'t found anything');
                    }
                } else {
                    $.sendMessage('Some error with the response');
                }
            } else {
                $.sendMessage('The server did not respond in time');
            }
        })
    }

    get routes() {
        return {
            'search' : 'searchHandler'
        }
    }
}

class StartController extends TelegramBaseController {
    
    startHandler($){
        $.runMenu({
            message: 'Hey what do you wanna do?',
            layout: 2,
            '/search': () => '/search', //will be on first line
            'test5': () => {}, //will be on third line
        })
    }

    get routes() {
        return {
            'start' : 'startHandler'
        }

    }

}




tg.router
    .when(['start'], new StartController())
    .when(['search'], new SearchController())
    .when(['ping'], new PingController())
