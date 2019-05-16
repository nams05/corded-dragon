'use strict'

const utils = require('../utils/utils');
const TradeModel = require('../models/trade.model');
const {body} = require('express-validator/check');

const tradeType = {
    BUY: "BUY",
    SELL: "SELL",
    UPDATE: "UPDATE",
    REMOVE: "REMOVE"
};

// validate request for add, update and delete trades
exports.validate = (method) => {
    switch(method){
        case 'update': {
            return [
                body('securityId','securityId doesn\'t exists').exists(),
                body('userId','userId doesn\'t exists').exists(),
                body('price','price doesn\' t exists').exists(),
                body('quantity','quantity doesn\' t exists').exists(),
                body('transactionType').isIn(['BUY','SELL','UPDATE','REMOVE'])
            ]

        }
    }
}

// add, update or delete a trade
exports.update = (request, response, next) => {
    console.log(request.body);
    request
    .getValidationResult()                  // gets result of validate function
    switch(request.body.transactionType){
        case "BUY":
        case "SELL": 
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
            break;

        case "UPDATE": 
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
            break;

        case "REMOVE": 
            TradeModel.findOneAndUpdate({tradeId: request.body.tradeId },{$set: {softDelete: true}},{new: true},(err, trade) => {
                // Handle any possible database errors
                    if (err) return response.status(500).send(err);
                    return response.send(trade);
                });
            break;
        
        default: return response.status(200).send({"success": true});
    }
    
}
