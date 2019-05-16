const mongoose = require('mongoose');

const tradeSchema = mongoose.Schema({
    tradeId: {type: Number, required: true, unique: true},
    securityId: {type: Number},
    quantity: {type:Number,required:true, min: 1},
    userId: {type: Number, required: true},
    price: {type: Number, required: true},
    transactionType: {
        type: String,
        enum: ['SELL', 'BUY'],
        required: true
    },
    softDelete: {type: Boolean, default: false}
}, {timestamps: true}); //creates createdAt and updatedAt fields for tracking

module.exports = mongoose.model('trade', tradeSchema, 'trades'); // creates a collection named trades with tradeSchema