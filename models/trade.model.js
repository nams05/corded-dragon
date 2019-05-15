const mongoose = require('mongoose');

const tradeSchema = mongoose.Schema({
    tradeId: {type: Number, required: true, unique: true},
    securityId: {type: Number, required: true},
    quantity: {type:Number,required:true, min: 1},
    userId: {type: Number, required: true},
    price: {type: Number, required: true, unique: true},
    transactionType: {
        type: String,
        enum: ['SELL', 'BUY'],
        required: true
    },
    softDelete: {type: Boolean, default: false}
}, {timestamps: true});

module.exports = mongoose.model('trade', tradeSchema, 'trades');