const mongoose = require('mongoose');

const securitySchema = mongoose.Schema({
    securityId: {type: Number, required: true, unique: true},
    name: {type: Number, required: true},
    price: {type: Number, required: true, unique: true},
    securityType: {type: String, enum: ['ST', 'BD', 'CUR', 'CSH', 'COM'], required: true},
    transctionType: {
        type: String,
        enum: ['SELL','BUY'],
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('security', securitySchema);