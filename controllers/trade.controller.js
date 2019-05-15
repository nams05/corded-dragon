'use strict'

const utils = require('../utils/utils');
const TradeModel = require('../models/trade.model');

const tradeType = {
    BUY: "BUY",
    SELL: "SELL",
    UPDATE: "UPDATE",
    REMOVE: "REMOVE"
};



exports.update = (request, response, next) => {
    console.log(request.body);
    switch(request.body.transactionType){
        case "BUY": 
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

        case "SELL": 
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
                    return response.send(trade);
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
