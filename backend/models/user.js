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
        friend: _id,
        history: [{
            message: String,
            time: { type : Date } //, default: Date.now }
        }]
    }],
    servers: [{server: _id}],
    avatarColor: int
})

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);
module.exports = User;