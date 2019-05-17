'use strict'

const utils = require('../utils/utils');
const TradeModel = require('../models/trade.model');
const PortfolioModel = require('../models/portfolio.model');
const {body} = require('express-validator/check');
const tradeType = require('../core/tradeType').tradeType;

const buySecurity = (request, response) =>{
    const buyTrade = new TradeModel({
        tradeId: request.body.tradeId,
        securityId: request.body.securityId,
        userId: request.body.userId,
        quantity: request.body.quantity,
        price: request.body.price,
        transactionType:  request.body.transactionType
    });

    buyTrade.save(err => {
        if (err) return response.status(500).send(err);
        else{
            PortfolioModel.findOne({securityId: request.body.securityId, userId: request.body.userId } , (err, userPortfolio) => {
                // Handle any possible database errors
                if (err) {
                    return response.status(500).send(err);
                }
                else if(!userPortfolio || userPortfolio.length === 0){
                    const createPortfolio = new PortfolioModel({
                        tradeId: request.body.tradeId,
                        securityId: request.body.securityId,
                        userId: request.body.userId,
                        quantity: request.body.quantity,
                        price: request.body.price,
                        transactionType:  request.body.transactionType
                    });
                
                    createPortfolio.save(err => {
                        if (err) return response.status(500).send(err);
            
                    })
                }
                else{
                    PortfolioModel.update({securityId: request.body.securityId, userId: request.body.userId }, {$inc: {quantity: (request.body.quantity)}}, {upsert: true, new: true, runValidators: true}, (err, updateUserPortfolio) => {
                        // Handle any possible database errors
                        if (err) return response.status(500).send(userPortfolio);
                        
                    });
                }
                //return response.send(userPortfolio); //return the updated trade
            });
            return response.status(200).send(buyTrade);
        }
        
    });
}

const sellSecurity = (request, response) =>{

    PortfolioModel.findOne({securityId: request.body.securityId, userId: request.body.userId},(err, userPortfolio) => {
        if(err) return response.status(500).send("No security to sell");
        else if(userPortfolio.quantity >= request.body.quantity){
            const sellTrade = new TradeModel({
                tradeId: request.body.tradeId,
                securityId: request.body.securityId,
                userId: request.body.userId,
                quantity: request.body.quantity,
                price: request.body.price,
                transactionType:  request.body.transactionType
            });

            sellTrade.save(err => {
                if (err) return response.status(500).send(err);
                else {
                    PortfolioModel.update({securityId: request.body.securityId, userId: request.body.userId }, {$inc: {quantity: ( -1 * request.body.quantity)}}, {upsert: true, new: true, runValidators: true}, (err, updateUserPortfolio) => {
                        // Handle any possible database errors
                        if (err) return response.status(500).send(userPortfolio);
                        
                    });
                }
                return response.status(200).send(sellTrade);
            });
        }
        else
            return response.status(500).send("You don't have " + request.body.quantity + " securities to sell." );
    });
}

const updateTrade = (request, response) => {
    let updatedTrade = {
        tradeId: request.body.tradeId,
        securityId: request.body.securityId,
        userId: request.body.userId,
        quantity: request.body.quantity,
        price: request.body.price
    };
    TradeModel.findOneAndUpdate({tradeId: request.body.tradeId }, {$set: updatedTrade}, {new: true}, (err, trade) => {
        // Handle any possible database errors
        if (err) return response.status(500).send(err);
        return response.send(trade); //return the updated trade
    });
}
const removeTrade = (request, response) => {
    TradeModel.findOneAndUpdate({tradeId: request.body.tradeId }, {$set: {softDelete: true}}, {new: true}, (err, trade) => {
    // Handle any possible database errors
        if (err) return response.status(500).send(err);
        return response.send(trade);
    });
}
// add, update or delete a trade
exports.update = (request, response, next) => {
    console.log(request.body);
    request
    .getValidationResult()  // gets result of validate function
    //.then(utils.validationHandler()) 
    .then(() => {
        switch(request.body.transactionType){
            case tradeType.BUY:
                buySecurity(request, response);
                break;

            case tradeType.SELL: 
                sellSecurity(request, response);
                break;
    
            case tradeType.UPDATE: 
                updateTrade(request, response);
                break;
    
            case tradeType.REMOVE: 
                removeTrade(request, response);
                break;
            
            default: return response.status(500).send({"message": 'No'});
        }
    })
    .catch(next);                
        
}
