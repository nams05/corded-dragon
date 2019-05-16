const mongoose = require('mongoose');

const PortfolioSchema = mongoose.Schema({
    securityId: {type: Number},
    quantity: {type:Number,required:true, min: 1},
    userId: {type: Number, required: true},
    softDelete: {type: Boolean, default: false}
}, {timestamps: true}); //creates createdAt and updatedAt fields for tracking

module.exports = mongoose.model('portfolio', PortfolioSchema, 'portfolio'); // creates a collection named trades with tradeSchema