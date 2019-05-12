'use strict'

const tradeController = require('../controllers/trade.controller')
const portfolioController = require('../controllers/portfolio.controller')

module.exports = (app) => {
    app.post('/updateTrade', tradeController.update);
    
}