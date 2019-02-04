var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var serverSchema = new Schema({
    serverName: String,
    ownerName: String,
<<<<<<< HEAD
    members: [{memberName: String}],
    chatId: String,
=======
    members: [{
        memberId: String,
        username: String,
    }],
    messageId: String,
>>>>>>> be53a098587e5bafb291f4bf9701c01502d45c28
})



serverSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Server', serverSchema);