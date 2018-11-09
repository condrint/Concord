var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var serverSchema = new Schema({
    owner: _id,
    members: [{member: _id}],
    chatHistory: [{
        user: _id,
        message: String,
        time: { type : Date } //, default: Date.now }
    }]
})

serverSchema.plugin(uniqueValidator);

const Server = mongoose.model('Server', serverSchema);
module.exports = Server;