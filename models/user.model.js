const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userId: {type: Number, required: true, unique: true},
    userName: {type: String, required: true}
}, {timestamps: true});

module.exports = mongoose.model('user', userSchema, 'users');  // create a collection named users with userSchema