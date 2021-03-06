'use strict'

const mongoose = require('mongoose');
const TradeModel = require('../models/trade.model');
const tradeType = require('../core/tradeType');
const utils = require('../utils/utils');
const Security = require('../models/security.model');
const User = require('../models/user.model');

exports.fetchPortfolio = (request, response) => {
   TradeModel.find().where('userId').equals(request.params.userId).
    then(userFolio => {
        if(!userFolio || userFolio.length === 0){
            return response.status(500).send({
                message: "User not found with Id: "+ request.params.userId
            });
        }
        User.findOne().where('userId').equals(request.params.userId).then(user => {
            response.send(utils.formatPortfolio(userFolio, user));    
        });
    }).
    catch(error => {
        if(error.kind === 'ObjectId'){
            return response.status(500).send({
                message: "User not found with Id: "+ request.params.userId
            });
        }
        return response.status(500).send({
            message: "Error retrieving portfolio for user with Id:" + request.params.userId
        });
    });
}

exports.fetchHoldings = (request, response) => {
  
    TradeModel.find({}).
    where('userId').equals(request.params.userId).
    where('softDelete').equals(false).
    sort('createdAt').
    select('securityId quantity price transactionType').
    then(userPortfolio => {
        if(!userPortfolio || userPortfolio.length === 0){
            return response.status(500).send({
                message: "User not found with Id: "+ request.params.userId
            });
        }
        TradeModel.find().where('userId').equals(request.params.userId).distinct('securityId', function(err, securityIds){
            Security.find({'securityId': {$in: securityIds}}, function(err, securities){
                response.send(utils.formatHoldingsResponse(userPortfolio, securities));
            });
        });
    });
}


exports.fetchReturns = (request, response) => {
    let returns = 0;

    TradeModel.find({}).
    where('userId').equals(request.params.userId).
    where('softDelete').equals(false).
    sort('createdAt').
    select('securityId quantity price transactionType').
    then(userPortfolio => {
        if(!userPortfolio || userPortfolio.length === 0){
            return response.status(500).send({
                message: "User not found with Id: "+ request.params.userId
            });
        }
        TradeModel.find().where('userId').equals(request.params.userId).distinct('securityId', function(err, securityIds){
            Security.find({'securityId': {$in: securityIds}}, function(err, securities){
                response.send(utils.formatReturnResponse(userPortfolio, securities));
            });
        });
    });
}