const mongoose = require('mongoose');
const config = require('../config/config');
const tradeType = require('../core/tradeType').tradeType;

const tradeSchema = mongoose.Schema({
    tradeId: {type: Number, unique: true, default: 0},
    securityId: {type: Number, required: true},
    quantity: {type:Number,required: true, min: 1},
    userId: {type: Number, required: true},
    price: {type: Number, required: true, unique: false, min: config.tickSize},
    transactionType: {
        type: String,
        enum: [ tradeType.SELL, tradeType.BUY],
        required: true
    },
    softDelete: {type: Boolean, default: false}
}, {timestamps: true}); //creates createdAt and updatedAt fields for tracking

module.exports = mongoose.model('trade', tradeSchema, 'trades'); // creates a collection named trades with tradeSchema