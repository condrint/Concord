var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var serverSchema = new Schema({
    serverName: String,
    ownerName: String,
<<<<<<< HEAD
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
=======
    members: [{memberName: String}],
    chatId: String,
>>>>>>> 872bec8aa6eca054877793b560d8000d85c01ef4
})



serverSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Server', serverSchema);