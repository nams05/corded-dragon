'use strict'

const mongoose = require('mongoose');
const PortfolioModel = require('../models/trade.model');

exports.fetchPortfolio = (request, response) => {
    PortfolioModel.find().
    where('userId').equals(request.params.userId).
    then(userFolio => {
        if(!userFolio || userFolio.length === 0){
            return response.status(404).send({
                message: "User not found with Id: "+ request.params.userId
            });
        }
        
        response.send(userFolio);

    }).
    catch(error => {
        if(error.kind === 'ObjectId'){
            return response.status(404).send({
                message: "User not found with Id: "+ request.params.userId
            });
        }
        return response.status(500).send({
            message: "Error retrieving portfolio for user with Id:" + request.params.userId
        });
    });
}

exports.fetchHoldings = (request, response) => {
  
    PortfolioModel.find({}).
    where('userId').equals(request.params.userId).
    where('softDelete').equals(false).
    sort('-createdAt').
    select('securityId quantity price transactionType').
    then(userPortfolio => {
        if(!userPortfolio || userPortfolio.length === 0){
            return response.status(404).send({
                message: "User not found with Id: "+ request.params.userId
            });
        }
        
        let holdingsDict = new Object();
        userPortfolio.forEach((tradeLine) => {
           if(tradeLine.securityId in holdingsDict){
               if(tradeLine.transactionType === "BUY"){
                    holdingsDict[tradeLine.securityId].price= (holdingsDict[tradeLine.securityId].buyQuantity*holdingsDict[tradeLine.securityId].price + tradeLine.quantity*tradeLine.price) / (holdingsDict[tradeLine.securityId].buyQuantity+tradeLine.quantity);
                    holdingsDict[tradeLine.securityId].buyQuantity += tradeLine.quantity; 
                    holdingsDict[tradeLine.securityId].quantity += tradeLine.quantity;
                }
               else{
                    holdingsDict[tradeLine.securityId].quantity -= tradeLine.quantity;
               }
           }
           else{
               if(tradeLine.transactionType === "BUY"){
                    holdingsDict[tradeLine.securityId] = {buyQuantity:tradeLine.quantity, quantity:tradeLine.quantity, price:tradeLine.price};
               }
               else{
                    holdingsDict[tradeLine.securityId] = {buyQuantity:0, quantity:tradeLine.quantity, price:100};
               }
               
           }
        });
        response.send(holdingsDict);
    });
}


exports.fetchReturns = (request, response) => {
    let returns = 0;

    PortfolioModel.find({}).
    where('userId').equals(request.params.userId).
    where('softDelete').equals(false).
    sort('-createdAt').
    select('securityId quantity price transactionType').
    then(userPortfolio => {
        if(!userPortfolio || userPortfolio.length === 0){
            return response.status(404).send({
                message: "User not found with Id: "+ request.params.userId
            });
        }
        
        let holdingsDict = new Object();
        userPortfolio.forEach((tradeLine) => {
           if(tradeLine.securityId in holdingsDict){
               if(tradeLine.transactionType === "BUY"){
                    holdingsDict[tradeLine.securityId].price= (holdingsDict[tradeLine.securityId].buyQuantity*holdingsDict[tradeLine.securityId].price + tradeLine.quantity*tradeLine.price) / (holdingsDict[tradeLine.securityId].buyQuantity+tradeLine.quantity);
                    holdingsDict[tradeLine.securityId].buyQuantity += tradeLine.quantity; 
                    holdingsDict[tradeLine.securityId].quantity += tradeLine.quantity;
                }
               else{
                    holdingsDict[tradeLine.securityId].quantity -= tradeLine.quantity;
               }
           }
           else{
               if(tradeLine.transactionType === "BUY"){
                    holdingsDict[tradeLine.securityId] = {buyQuantity:tradeLine.quantity, quantity:tradeLine.quantity, price:tradeLine.price};
               }
               else{
                    holdingsDict[tradeLine.securityId] = {buyQuantity:0, quantity:tradeLine.quantity, price:100};
               }
               
           }
        });
       
        for(let security in holdingsDict){   
            returns += (100 - holdingsDict[security].price) * holdingsDict[security].quantity;
        }
        response.send({returns: returns});
    });
}