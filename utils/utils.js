const {body} = require('express-validator/check');
const tradeType = require('../core/tradeType').tradeType;
const Messages = require('../config/messages');


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

const roundOff = (number) => {
    return Math.round(number * 100) / 100;
}

const getHoldingsAsDict = (userPortfolio, securities) => {
    let holdingsDict = new Object();
    userPortfolio.forEach((tradeLine) => {
       if(tradeLine.securityId in holdingsDict){
           if(tradeLine.transactionType === tradeType.BUY ){
                holdingsDict[tradeLine.securityId].averageBuyPrice= (holdingsDict[tradeLine.securityId].buyQuantity*holdingsDict[tradeLine.securityId].averageBuyPrice + tradeLine.quantity * tradeLine.price) / (holdingsDict[tradeLine.securityId].buyQuantity+tradeLine.quantity);
                holdingsDict[tradeLine.securityId].buyQuantity += tradeLine.quantity; 
                holdingsDict[tradeLine.securityId].quantity += tradeLine.quantity;
            } else{
                holdingsDict[tradeLine.securityId].quantity -= tradeLine.quantity;
           }
       }
       else{
           if(tradeLine.transactionType === tradeType.BUY){
                holdingsDict[tradeLine.securityId] = {buyQuantity: tradeLine.quantity, quantity: tradeLine.quantity, averageBuyPrice: tradeLine.price};   
                if (securities){
                    holdingsDict[tradeLine.securityId].securityName = securities[tradeLine.securityId].name;
                    holdingsDict[tradeLine.securityId].securitySymbol = securities[tradeLine.securityId].symbol;
                    holdingsDict[tradeLine.securityId].securityType= securities[tradeLine.securityId].type;
                    holdingsDict[tradeLine.securityId].ltp= securities[tradeLine.securityId].ltp;
                }
           }          
       }
       holdingsDict[tradeLine.securityId].averageBuyPrice = roundOff(holdingsDict[tradeLine.securityId].averageBuyPrice);
    });
    return holdingsDict;
}

const convertListToHashtable = (securities) => {
    let securitiesHT = new Object();
    if (securities) {
        securities.forEach((security) => {
            securitiesHT[security.securityId] = {symbol: security.symbol, type: security.securityType, name: security.name, ltp: security.lastTradedPrice};
        });
    }
    return securitiesHT;
}

exports.validate = function(request, response) {
    var body = request.body;
    if ((!body.securityId || !body.userId || !body.price || !body.quantity) && !body.transactionType) {
        return false;
    } else {
        return true;
    }
}

exports.formatTradeResponse = function (trade) {
    let response = new Object();
    response.status = Messages.success;   
    response.trade = formatTrade(trade);
    return response;
}

exports.formatHoldingsResponse = function (userPortfolio, securities) {
    securities = convertListToHashtable(securities);
    let response = new Object();
    response.status = Messages.success;
    response.holdings = getHoldingsAsDict(userPortfolio, securities);
    return response;
}

exports.formatReturnResponse = (userPortfolio, securities) => {
    securities = convertListToHashtable(securities)
    let response = new Object();
    let holdings = getHoldingsAsDict(userPortfolio, securities);
    let returns = new Object();
    let pl = 0;
    for(let security in holdings){
        pl += (holdings[security].ltp - holdings[security].averageBuyPrice) * holdings[security].quantity;
    }
    
    if (pl < 0) {
        returns.loss = roundOff(-1 * pl);
    } else {
        returns.profit = roundOff(pl);
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