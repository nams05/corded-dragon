const {body} = require('express-validator/check');
const tradeType = require('../core/tradeType').tradeType;
const Messages = require('../config/messages');

exports.validate = function(request, response) {
    var body = request.body;
    if (!body.securityId || !body.userId || !body.price || !body.quantity || !body.transactionType) {
        return false;
    } else {
        return true;
    }
}

const formatTrade = (trade) =>{
    let tradeResponse = new Object();
    tradeResponse.tradeId = trade.tradeId;
    tradeResponse.securityId = trade.securityId;
    tradeResponse.userId = trade.userId;
    tradeResponse.quantity = trade.quantity;
    tradeResponse.createdAt = trade.createdAt;
    tradeResponse.updatedAt = trade.updatedAt;
    tradeResponse.transactionType = trade.transactionType;
    return tradeResponse;
}

exports.formatTradeResponse = function (trade) {
    let response = new Object();
    response.status = Messages.success;   
    response.trade = formatTrade(trade);
    return response;
}

exports.formatHoldingsResponse = function (userPortfolio) {
    let response = new Object();

    let holdingsDict = new Object();
    userPortfolio.forEach((tradeLine) => {
       if(tradeLine.securityId in holdingsDict){
           if(tradeLine.transactionType === tradeType.BUY ){
                holdingsDict[tradeLine.securityId].averageBuyPrice= (holdingsDict[tradeLine.securityId].buyQuantity*holdingsDict[tradeLine.securityId].averageBuyPrice + tradeLine.quantity * tradeLine.price) / (holdingsDict[tradeLine.securityId].buyQuantity+tradeLine.quantity);
                holdingsDict[tradeLine.securityId].buyQuantity += tradeLine.quantity; 
                holdingsDict[tradeLine.securityId].quantity += tradeLine.quantity;
            }
           else{
                holdingsDict[tradeLine.securityId].quantity -= tradeLine.quantity;
           }
       }
       else{
           if(tradeLine.transactionType === tradeType.BUY){
                holdingsDict[tradeLine.securityId] = {buyQuantity: tradeLine.quantity, quantity: tradeLine.quantity, averageBuyPrice: tradeLine.price};
           }          
       }
    });
    response.status = Messages.success;
    response.holdings = holdingsDict;
    return response;
}

exports.formatReturnResponse = (userPortfolio) => {
    let response = new Object();
    let holdings = this.formatHoldingsResponse(userPortfolio).holdings;
    let returns = 0;
    for(let security in holdings){   
        returns += (100 - holdings[security].averageBuyPrice) * holdings[security].quantity;
    }
    
    response.status = Messages.success;
    response.returns = returns;
    return response;
}

exports.formatPortfolio = function (userPortfolio, user) {
    let response = new Object();
    if (user) response.userName = user.userName;
    if (user) response.userId = user.userId;
    response.status = Messages.success;
    
    let portfolio = new Object();    
    userPortfolio.forEach((tradeLine) => {
       if(tradeLine.securityId in portfolio){
            portfolio[tradeLine.securityId].push(formatTrade(tradeLine));
       } else{
            portfolio[tradeLine.securityId] = [formatTrade(tradeLine)];
       }
    });
    response.portfolio = portfolio;
    return response;
}