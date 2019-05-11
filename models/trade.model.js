const mongoose = require('mongoose');

const tradeSchema = mongoose.Schema({
    securityId: {type: Number, required: true, unique: true},
    userId: {type: Number, required: true},
    price: {type: Number, required: true, unique: true},
    transctionType: {
        type: String,
        enum: ['SELL','BUY'],
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('trade', tradeSchema);