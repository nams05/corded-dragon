'use strict'

const utils = require('../utils/utils');
const TradeModel = require('../models/trade.model');
const tradeType = {
    BUY: "BUY",
    SELL: "SELL",
    UPDATE: "UPDATE",
    REMOVE: "REMOVE"

}

exports.update = (request, response) => {
    console.log(request.body);
    if(!utils.validRequest(request))
        return response.status(400).send({"success": false}); //add a failure message

    const tradeModel = new TradeModel({
        securityId: 1,
        userId: 100001,
        price: 500,
        transctionType: tradeType.BUY,
        
    });

    tradeModel.save();

    return response.status(200).send({"success": true});

}
