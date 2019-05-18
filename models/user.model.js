const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    trades: [Number],
}, {timestamps: true});

module.exports = mongoose.model('user', userSchema, 'users');  // create a collection named users with userSchema