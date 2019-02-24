var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    friends: [{
        friendId: String,
        username: String,
        messageId: String,
        avatarUrl: String,
    }],
    servers: [{servername: String}],
    avatarUrl: {
        type: String,
    },
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);