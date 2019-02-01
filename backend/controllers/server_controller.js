const Server = require('../models/server.js');
const User = require('../models/user.js');
const messageController = require('../controllers/message_controller');

const serverController = {};

serverController.createServer = async (req, res) => {
    const { serverName } = req.body;
    const newServer = new Server({ serverName });
    try {
        let createdServer = await newServer.save();
        return res.status(201).json({
            success: true,
            message: 'Server successfully created!',
        })

    }
    
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

userController.getMembers = async (req, res) => {
    const { me } = req.body;
    try {
        let meDocument = await Server.findById(me);

        let listOfMemberObjects = convertToClientMemberObjects(meDocument.members);

        return res.status(200).json({
            success: true,
            message: 'Members got.',
            members: listOfFriendObjects,
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

convertToClientMemberObjects = (members) => {
    listOfMemberObjects = []
    for (let member of members){
        let memberObject = {
            chatId: member.chatId,
            memberId: member.memberId,
            username: member.username
        }
        listOfFriendObjects.push(memberObject);
    }
    return listOfMemberObjects;
}

serverController.newMember = async (req, res) => {
    try{
        const { newMember, me } = req.body;

        let newMemberDocument = await User.findOne({
            username: newMember,
        });

        if (!newMemberDocument) {
            return res.status(200).json({
                success: false,
                message: "User doesn't exist.",
            });
        }

        let newMemberID = newMemberDocument._id.toString();
        let newMemberUsername = newMemberDocument.username.toString();

        let meDocument = await Server.findOne({
            _id: me,
        });

        for (let member of meDocument.members){
            if(member._id == newMemberID){
                return res.status(200).json({
                    success: false,
                    message: "This user is already a member of this server."
                });
            }
        }

        newMessageID = await messageController.createNewMessage([me, newMemberID]);

        if (!newMessageId){
            return res.status(200).json({
                success: false,
                message: "Error creating mutual message log between server and new Member."
            })
        }

        //updating new member into server's member list
        let newMemberEntry = {
            memberId: newMemberID,
            username: newMemberUsername,
            chatID: newMessageId
        }

        meDocument.members.push(newMemberEntry);
        meDocument.save();

        //updating server into new member's server list
        let meAsNewServer = {
            serverId: meDocument._id,
            servername: meDocument.serverName,
            chatId: newMessageId 
        }

        newMemberDocument.servers.push(meAsNewServer);
        newMemberDocument.save();

        return res.status(200).json({
            success: true,
            message: 'Member added',
        });

    }

    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}



module.exports = serverController;