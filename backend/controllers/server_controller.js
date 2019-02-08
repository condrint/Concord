const Server = require('../models/server.js');
const User = require('../models/user.js');
const messageController = require('../controllers/message_controller');

const serverController = {};

serverController.createServer = async (req, res) => {
    const { me, serverName } = req.body;
    const newServer = new Server({ owner, serverName });
    try {
        //check if server name already exists
        let newServerDocument = await Server.findOne({
            serverName: newServer,
        })
        if (newServerDocument){
            return res.status(200).json({
                success: false,
                message: "This server already exists.",
            });
        };

        //adds new server to database
        let createdServer = await newServer.save();
        
        //adds user as owner of new server
        let meDocument = await User.findOne({
            username: me,
        });
        createdServer.ownerName.push(meDocument);

        //adds new server to user's servers
        meDocument.servers.push(createdServer);

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

serverController.getMembers = async (req, res) => {
    const { serverId } = req.body;
    try {
        let serverDocument = await Server.findById(serverId);

        let listOfMemberObjects = convertToClientMemberObjects(serverDocument.members);

        return res.status(200).json({
            success: true,
            message: 'Members got.',
            members: listOfMemberObjects,
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
    listOfMemberObjects = [];
    for (let member of members){
        let memberObject = {
            memberId: member.memberId,
            username: member.username
        }
        listOfMemberObjects.push(memberObject);
    }
    return listOfMemberObjects;
}

serverController.joinServer = async (req, res) => {
    try{
        const { server, newMember } = req.body;

        let newMemberDocument = await User.findOne({
            username: newMember,
        });

        //checks if user exists
        if (!newMemberDocument) {
            return res.status(200).json({
                success: false,
                message: "User doesn't exist.",
            });
        }

        let newMemberID = newMemberDocument._id.toString();
        let newMemberUsername = newMemberDocument.username.toString();

        let serverDocument = await Server.findOne({
            serverName: server,
        });
        
        //checks if user is already member of server
        for (let member of serverDocument.members){
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

        serverDocument.members.push(newMemberEntry);
        serverDocument.save();

        //updating server into new member's server list
        let thisNewServer = {
            serverId: serverDocument._id,
            servername: serverDocument.serverName,
            chatId: newMessageId 
        }

        newMemberDocument.servers.push(thisNewServer);
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