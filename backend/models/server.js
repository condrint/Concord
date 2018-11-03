var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var serverSchema = new Schema({
    owner: _id,
    members: [{member: _id}],
    chatHistory: [{
        user: _id,
        message: string,
        time: int
    }]
})

serverSchema.plugin(uniqueValidator);