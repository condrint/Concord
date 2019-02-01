var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var serverSchema = new Schema({
    serverName: String,
    ownerName: String,
    members: [{
        memberId: String,
        username: String,
        chatId: String,
    }],
    chatHistory: [{
        userName: String,
        message: String,
        time: { type : Date } //, default: Date.now }
    }]
})

serverSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Server', serverSchema);