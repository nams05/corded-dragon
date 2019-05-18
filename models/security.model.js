const mongoose = require('mongoose');

const securitySchema = mongoose.Schema({
    securityId: {type: Number, required: true, unique: true},
    symbol: {type: Number, default: "Placeholder Name"},
    lastTradedPrice: {type: Number, required: true, unique: true}, // This is the last traded price for this security - currentPrice
    securityType: {type: String, enum: ['ST', 'BD', 'CUR', 'CSH', 'COM'], default: "ST"}
}, {timestamps: true}); 

module.exports = mongoose.model('security', securitySchema, 'security'); // create a collection named security with securitySchema