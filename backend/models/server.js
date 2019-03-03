var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var serverSchema = new Schema({
    serverName: String,
    ownerName: String,
    ownerId: String,
    members: [{
        memberName: String,
        memberId: String,
    }],
    messageId: String,
    avatarUrl: {
        type: String,
        default: 'https://res.cloudinary.com/hu51ij26o/image/upload/h_200,w_200/v1550456252/ioivickyj0denrhwj2wp.jpg' //doggy
    },
})

serverSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Server', serverSchema);