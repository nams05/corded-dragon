'use strict'

const tradeController = require('../controllers/trade.controller');
const portfolioController = require('../controllers/portfolio.controller');
const utils =  require('../utils/utils');

module.exports = (app) => {

    //create, update and delete a trade
    app.post('/updateTrade', utils.validate('update'), tradeController.update);

    //get all securities and trades of a user
    app.get('/fetchPortfolio/:userId', portfolioController.fetchPortfolio);

    //get all securities, avgerage buy price and quantity of a user
    app.get('/fetchHolding/:userId', portfolioController.fetchHoldings);

    //get cumulative returns of all securities of a user
    app.get('/fetchReturns/:userId', portfolioController.fetchReturns);
    
}