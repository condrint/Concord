var Message = require('../models/message.js');

const messageController = {};

// not called by client
messageController.createNewMessage = async (listOfParticipants) => {
    /* returns the ID of the newly created message document */ 
    const newMessage = new Message({
        participants: convertListToObjectsWithIds(listOfParticipants)
    });

    try {
        let createdMessage = await newMessage.save(); 
        return createdMessage._id;
    } 
    
    catch(error) {
        console.log(error);
        return -1;
    }
}

messageController.addMessage = async (req, res) => {

}

messageController.getMessage = async (req, res) => {

}

convertListToObjectsWithIds = (participants) => {
    return participants.map((id) => {
        participantId: id
    });
}

module.exports = userController;
