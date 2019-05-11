const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userId: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    trades: [Number]
}, {timestamps: true});

module.exports = mongoose.model('user', userSchema);