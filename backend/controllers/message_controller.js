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
        return '';
    }
}

messageController.addMessage = async (senderId, senderUseranme, message, messageId) => {
    try {
        console.log(messageId);
        let messageDocument = await Message.findById(messageId);

        let newMessageEntry = {
            senderId: senderId,
            senderUsername: senderUseranme,
            message: message,
        }

        messageDocument.history.push(newMessageEntry);
        messageDocument.save();

        return newMessageEntry;
    } 
    
    catch(error) {
        console.log(error);
        return '';
    }
}

messageController.getMessages = async (req, res) => {
    const { messageId } = req.body;
    try {
        let messageDocument = await Message.findById(messageId);
        
        if (!messageDocument){
            return res.status(200).json({
                success: false,
                message: 'No messages created between user - this might result from an error when adding the user.',
            });   
        }

        messageObject = {
            messageId: messageId,
            history: messageDocument.history
        }

        return res.status(200).json({
            success: true,
            message: 'Messages got.',
            messageObject: messageObject
        });     
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }

}

convertListToObjectsWithIds = (participants) => {
    return participants.map((id) => {
        participantId: id
    });
}

module.exports = messageController;
