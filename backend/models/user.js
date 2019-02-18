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
        default: 'https://res.cloudinary.com/hu51ij26o/image/upload/w_400,h_400,c_crop,g_face,r_max/w_200/v1550456252/ioivickyj0denrhwj2wp.jpg' //doggy
    },
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);