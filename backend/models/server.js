var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var serverSchema = new Schema({
    serverName: String,
    ownerName: String,
    members: [{
        memberId: String,
        username: String,
    }],
    messageId: String,
})



serverSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Server', serverSchema);