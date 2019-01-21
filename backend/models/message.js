var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var messageSchema = new Schema({
    participants: [{
        participantId: String // this is the list of Ids to emit to when this document is updated 
    }],
    history: [{
        senderId: String,
        senderUsername: String, 
        message: String,
        time: { type : Date } // default: Date.now 
    }],
})

messageSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Message', messageSchema);