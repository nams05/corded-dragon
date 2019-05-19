const mongoose = require('mongoose');

const securitySchema = mongoose.Schema({
    securityId: {type: Number, required: true, unique: true},
    symbol: {type: String, default: "Placeholder"},
    name: {type: String, default: "Placeholder"},
    lastTradedPrice: {type: Number, required: true}, // This is the last traded price for this security - currentPrice
    securityType: {type: String, enum: ['ST', 'BD', 'CUR', 'CSH', 'COM'], default: "ST"}
}, {timestamps: true}); 

module.exports = mongoose.model('security', securitySchema, 'security'); // create a collection named security with securitySchema