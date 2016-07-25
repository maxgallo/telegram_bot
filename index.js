'use strict'

const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const tg = new Telegram.Telegram('238717881:AAENx7Nu2Xrla9qNHd8HVrcg8Y26esqd-zc')


const SearchController = require('./controllers/SearchController');
const StartController  = require('./controllers/StartController');


tg.router
    .when(['start', 'radar'], new StartController())
    .when(['search'], new SearchController());
