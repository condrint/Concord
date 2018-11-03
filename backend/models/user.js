var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new Schema({
    username: {
        type: string,
        required: true,
        unique: true
    },
    password: {
        type: string,
        required: true
    },
    friends: [{
        friend: _id,
        history: [{
            message: string,
            time: int
        }]
    }],
    servers: [{server: _id}],
    avatarColor: int
})

userSchema.plugin(uniqueValidator);