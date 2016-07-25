const request = require('request');
const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const constants = require('../constants');

class SearchController extends TelegramBaseController {

    searchHandler($){
        request(constants.POKEVISION_URL, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var parsedBody;
                try {
                    parsedBody = JSON.parse(body);
                } catch (err) {
                    $.sendMessage('An error occurred while parsing the body response');
                }

                if(parsedBody && parsedBody.status === 'success'){
                    var good  = parsedBody.pokemon.filter(function(pokemon){
                        return !!whiteList[pokemon.pokemonId];
                    });

                    if(good.length) {
                        $.sendMessage(good.reduce( (previous, current) => previous + ', ' + pokedex[current.pokemonId], 'I\'ve found: '));
                    } else {
                        $.sendMessage('I haven\'t found anything');
                    }
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

module.exports = SearchController;
