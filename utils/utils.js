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

exports.validationHandler = next => result => {
    if (result.isEmpty()) return
    if (!next)
      return Promise.reject(result.array().map(i => `'${i.param}': ${i.msg}`).join(' '))
  else
    return next(
      Promise.reject(result.array().map(i => `'${i.param}': ${i.msg}`).join(' '))
    )
}

exports.formatTradeResponse = function (trade) {
    let response = new Object();
    response.status = Messages.success;

    let tradeResponse = new Object();
    tradeResponse.tradeId = trade.tradeId;
    tradeResponse.securityId = trade.securityId;
    tradeResponse.userId = trade.userId;
    tradeResponse.quantity = trade.quantity;
    tradeResponse.createdAt = trade.createdAt;
    tradeResponse.updatedAt = trade.updatedAt;
    tradeResponse.transactionType = trade.transactionType;
    
    response.trade = tradeResponse;
    return response;
}

exports.formatHoldingsResponse = function (userPortfolio) {
    let holdingsDict = new Object();
    userPortfolio.forEach((tradeLine) => {
       if(tradeLine.securityId in holdingsDict){
           if(tradeLine.transactionType === tradeType.BUY ){
                holdingsDict[tradeLine.securityId].averageBuyPrice= (holdingsDict[tradeLine.securityId].buyQuantity*holdingsDict[tradeLine.securityId].price + tradeLine.quantity * tradeLine.price) / (holdingsDict[tradeLine.securityId].buyQuantity+tradeLine.quantity);
                holdingsDict[tradeLine.securityId].buyQuantity += tradeLine.quantity; 
                holdingsDict[tradeLine.securityId].quantity += tradeLine.quantity;
            }
           else{
                holdingsDict[tradeLine.securityId].quantity -= tradeLine.quantity;
           }
       }
       else{
           if(tradeLine.transactionType === tradeType.BUY){
                holdingsDict[tradeLine.securityId] = {buyQuantity:tradeLine.quantity, quantity:tradeLine.quantity, price:tradeLine.price};
           }
           else{
                holdingsDict[tradeLine.securityId] = {buyQuantity:0, quantity:tradeLine.quantity, price: tradeLine.price};
           }
           
       }
    });
    return holdingsDict;
}


exports.formatPortfolio = function (userPortfolio, user) {
    let response = new Object();
    if (user) response.userName = user.userName;
    if (user) response.userId = user.userId;
    response.status = Messages.success;
    
    let portfolio = new Object();    
    userPortfolio.forEach((tradeLine) => {
       if(tradeLine.securityId in portfolio){
            portfolio[tradeLine.securityId].push(tradeLine)
       } else{
            portfolio[tradeLine.securityId] = [tradeLine];
       }
    });
    response.portfolio = portfolio;
    return response;
}