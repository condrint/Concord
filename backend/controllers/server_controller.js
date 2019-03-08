const Server = require('../models/server.js');
const User = require('../models/user.js');
const messageController = require('../controllers/message_controller');
const Message = require('../models/message.js');

const serverController = {};

serverController.createServer = async (req, res) => {
    const { me, serverName } = req.body;
    
    try {
        //check if server name already exists
        let newServerDocument = await Server.findOne({
            serverName: serverName,
        })
        if (newServerDocument){
            return res.status(200).json({
                success: false,
                message: "This server already exists.",
            });
        };
        
        newMessageId = await messageController.createNewMessage([me]);

        let meDocument = await User.findOne({
            _id: me
        });
        
        //creates new server with new parameters
        const newServer = new Server({
            serverName: serverName,
            ownerName: meDocument.username,
            ownerId: meDocument._id,
            members: [],
            messageId: newMessageId
        })

        let firstMember = {
            memberName: meDocument.username,
            memberId: meDocument._id 
        }


        newServer.members.push(firstMember);
        await newServer.save();
        
        console.log(newServer.ownerName);
        console.log(newServer.ownerId);
        console.log(newServer.members);
        console.log(newMessageId);
        
        //adds new server to user's servers
        let serverObject = {
            serverId: newServer._id
        }
        meDocument.servers.push(serverObject);
        await meDocument.save();
        console.log(meDocument.servers);

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
            _id: newMember,
        });

        //checks if user exists - do we need this?
        if (!newMemberDocument) {
            return res.status(200).json({
                success: false,
                message: "User doesn't exist.",
            });
        }

        let newMemberID = newMemberDocument._id.toString();
        
        let serverDocument = await Server.findOne({
            serverName: server,
        });
        
        //checks if user is already member of server
        for (let member of serverDocument.members){
            if(member.memberId == newMemberID){
                return res.status(200).json({
                    success: false,
                    message: "You are already a member of this server."
                });
            }
        }
        
        //updating new member into server's member list
        let memberObject = {
            memberName: newMemberDocument.username,
            memberId: newMemberID
        }

        serverDocument.members.push(memberObject);
        let messageDocument = await Message.findOne({
            _id: serverDocument.messageId
        });
        
        let newParticipant = {
            participantId: newMemberID
        }

        messageDocument.participants.push(newParticipant);
        await messageDocument.save();
        await serverDocument.save();
        console.log(messageDocument.participants);
        console.log(serverDocument.members);

        //adds new server to user's servers
        let serverObject = {
            serverId: serverDocument._id
        }
        newMemberDocument.servers.push(serverObject);
        await newMemberDocument.save();
        //console.log(newMemberDocument.servers);

        return res.status(200).json({
            success: true,
            message: 'You have joined the server: ' + server + '.',
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

serverController.deleteServer = async (req, res) => {
    //delete server from database
    //delete server from members' servers list
    //delete message document associated with server

    const { server, messageId } = req.body;
    try{
        let serverDocument = await Server.findById(server);
        
        await Message.findbyIdAndDelete(messageId);
        // delete the server from each members' server list
        for (member of serverDocument.members){
            let memberDocument = await User.findById(member);
            let servers = memberDocument.servers;
            memberDocument.servers = servers.filter(serverObject => serverObject.serverId != server);
            await memberDocument.save();
            socketFunctions.refreshUsersServers(member);
        }

        await Server.findByIdAndDelete(server);

        return res.status(200).json({
            success: true,
            message: "Server deleted"
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