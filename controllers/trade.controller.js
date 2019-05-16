'use strict'

const utils = require('../utils/utils');
const TradeModel = require('../models/trade.model');
const {body} = require('express-validator/check');
const tradeType = require('../core/tradeType')


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
        return response.status(200).send(buyTrade);
    });
}

const sellSecurity = (request, response) =>{
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
        return response.status(200).send(sellTrade);
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
    TradeModel.findOneAndUpdate({tradeId: request.body.tradeId },{$set: updatedTrade},{new: true},(err, trade) => {
        // Handle any possible database errors
        if (err) return response.status(500).send(err);
        return response.send(trade); //return the updated trade
    });
}
const removeTrade = (request, response) => {
    TradeModel.findOneAndUpdate({tradeId: request.body.tradeId },{$set: {softDelete: true}},{new: true},(err, trade) => {
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
    .then(utils.validationHandler()) 
    .then(() => {
        switch(request.body.transactionType){
            case tradeType.tradeType.BUY:
                buySecurity(request, response);
                break;

            case tradeType.tradeType.SELL: 
                sellSecurity(request, response);
                break;
    
            case tradeType.tradeType.UPDATE: 
                updateTrade(request, response);
                break;
    
            case tradeType.tradeType.REMOVE: 
            removeTrade(request, response);
                break;
            
            default: return response.status(500).send({"message": 'No'});
        }
    
    })
    .catch(next);                
        
}
