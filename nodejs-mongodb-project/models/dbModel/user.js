const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    displayUsername: {
        type: String,
        required: true,
        minlength: 5,
        maxlength:100
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    token: {
        type: String,   
        maxlength: 1024
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id}, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);
exports.User = User;