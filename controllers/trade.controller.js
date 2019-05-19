'use strict'

const utils = require('../utils/utils');
const TradeModel = require('../models/trade.model');
const User = require('../models/user.model');
const Security = require('../models/security.model');
const PortfolioModel = require('../models/portfolio.model');
const {body} = require('express-validator/check');
const tradeType = require('../core/tradeType').tradeType;

const buySecurity = (request, response) =>{
    TradeModel.countDocuments({}, function(err, count) {
        const buyTrade = new TradeModel({
            tradeId: count+1,
            securityId: request.body.securityId,
            userId: request.body.userId,
            quantity: request.body.quantity,
            price: request.body.price,
            transactionType:  request.body.transactionType
        });

        buyTrade.save(err => {
            if (err) return response.status(500).send(err);
            else{
                updateUserPortfolio(request, response);
                updateCurrentPriceForSecurity(request);
                updateUser(request)
                return response.status(200).send(utils.formatTradeResponse(buyTrade));
            } 
        });
    });   
}

const updateCurrentPriceForSecurity = (request) => {
    if(request.body.securityName && request.body.securitySymbol){
        Security.findOneAndUpdate({securityId: request.body.securityId}, 
            {$set: {lastTradedPrice: request.body.price, symbol: request.body.securitySymbol, type: request.body.securityType, name: request.body.securityName}}, 
            {upsert: true, returnNewDocument: true}, function(err, record){
                if (err){
                    console.log(err);
                    return;
                }
                console.log("Security updated:" + record);
        });
    }
}

const updateUser = (request) => {
    if(request.body.userName){
        User.findOneAndUpdate({userId: request.body.userId}, 
            {$set: {userName: request.body.userName}}, 
            {upsert: true, returnNewDocument: true}, function(err, record){
                if (err){
                    console.log(err);
                    return;
                }
                console.log("User updated:" + record);
            });
    }
}

const updateUserPortfolio = (request, response) => {
    PortfolioModel.findOne({userId: request.body.userId , securityId: request.body.securityId} , (err, userPortfolio) => {
        // Handle any possible database errors
        if (err) {
            return response.status(500).send(err);
        } else if(!userPortfolio || userPortfolio.length === 0){
            const createPortfolio = new PortfolioModel({
                securityId: request.body.securityId,
                userId: request.body.userId,
                quantity: request.body.quantity,
                price: request.body.price
            });
        
            createPortfolio.save(err => {
                if (err) return response.status(500).send(err);
            })
        } else{
            PortfolioModel.updateOne({securityId: request.body.securityId, userId: request.body.userId}, {$inc: {quantity: (request.body.quantity)}}, {upsert: true, new: true, runValidators: true}, (err, updateUserPortfolio) => {
                // Handle any possible database errors
                if (err) return response.status(500).send(userPortfolio);
            });
        }
        //return response.send(userPortfolio); //return the updated trade
    });
}

const sellSecurity = (request, response) => {
    if (request.body.quantity < 0) return response.status(401).send();
    PortfolioModel.findOne({securityId: request.body.securityId, userId: request.body.userId},(err, userPortfolio) => {
        if(err || !userPortfolio) return response.status(401).send("No security to sell");
        else if(userPortfolio.quantity >= request.body.quantity){
            TradeModel.countDocuments({}, function(err, count) {
                const sellTrade = new TradeModel({
                    tradeId: count + 1,
                    securityId: request.body.securityId,
                    userId: request.body.userId,
                    quantity: request.body.quantity,
                    price: request.body.price,
                    transactionType:  request.body.transactionType
                });
                sellTrade.save(err => {
                    if (err) return response.status(500).send(err);
                    else {
                        reduceQuantityInPortfolio(request);
                        updateCurrentPriceForSecurity(request);
                    }
                    return response.status(200).send(utils.formatTradeResponse(sellTrade));
                });
            });
        } else {
            return response.status(401).send("You don't have " + request.body.quantity + " securities to sell." );
        }
    });
}

const reduceQuantityInPortfolio = (request) => {
    PortfolioModel.updateOne({securityId: request.body.securityId, userId: request.body.userId }, {$inc: {quantity: (-1 * request.body.quantity)}}, {upsert: true, new: true, runValidators: true}, (err, updateUserPortfolio) => {
        // Handle any possible database errors
        if (err) return response.status(500).send(userPortfolio);
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
    TradeModel.findOneAndUpdate({tradeId: request.body.tradeId}, {$set: updatedTrade}, {new: true}, (err, trade) => {
        // Handle any possible database errors
        if (err) return response.status(500).send(err);
        return response.send(utils.formatTradeResponse(trade)); //return the updated trade
    });
}
const removeTrade = (request, response) => {
    TradeModel.findOneAndUpdate({tradeId: request.body.tradeId}, {$set: {softDelete: true}}, {new: true}, (err, trade) => {
    // Handle any possible database errors
        if (err) return response.status(500).send(err);
        return response.send(utils.formatTradeResponse(trade));
    });
}
// add, update or delete a trade
exports.handleTrade = (request, response) => {
    console.log("Request body:", request.body);
    if (!utils.validate(request, response)){
        return response.status(400).send("Bad Request");
    };

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
}
