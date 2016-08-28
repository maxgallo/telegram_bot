'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const tg = new Telegram.Telegram('238717881:AAENx7Nu2Xrla9qNHd8HVrcg8Y26esqd-zc')


const StartController  = require('./controllers/StartController');

const constants = require('./constants');

tg.router
    .when([
            constants.route.START,
            constants.route.DISABLE_RADAR,
            constants.route.ENABLE_RADAR,
            constants.route.SIMPLE_SCAN
        ], new StartController())
    //.when(['search'], new SearchController());
