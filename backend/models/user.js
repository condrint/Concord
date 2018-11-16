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
        username: String,
        history: [{
            message: String,
            time: { type : Date } //, default: Date.now }
        }]
    }],
    servers: [{servername: String}],
    avatarColor: Number
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);