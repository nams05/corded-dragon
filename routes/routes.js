'use strict'

const tradeController = require('../controllers/trade.controller');
const portfolioController = require('../controllers/portfolio.controller');
const utils =  require('../utils/utils');

module.exports = (app) => {
    app.post('/updateTrade', utils.validate('update'), tradeController.update);

    app.get('/fetchPortfolio/:userId', portfolioController.fetchPortfolio);

    app.get('/fetchHolding/:userId', portfolioController.fetchHoldings);

    app.get('/fetchReturns/:userId', portfolioController.fetchReturns);
    
}