const socketFunctions = require('../server.js');
const User = require('../models/user.js');
const messageController = require('../controllers/message_controller');
const Message = require('../models/message.js');
const Server = require('../models/server.js');
const cloudinary = require('cloudinary');
const Datauri = require('datauri');

require('dotenv').load();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = require('twilio')(accountSid, authToken);

const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;

cloudinary.config({ 
    cloud_name: cloud_name, 
    api_key: api_key, 
    api_secret: api_secret
});

const userController = {};

userController.registerUser = async (req, res) => {
    const { username, password } = req.body;
    const newUser = new User({username, password});
    try {
        newUser.avatarUrl = 'https://res.cloudinary.com/hu51ij26o/image/upload/h_200,w_200/v1550456252/ioivickyj0denrhwj2wp.jpg';
        newUser.theme = 1;
        await newUser.save(); 
        return res.status(201).json({
            success: true,
            message: 'Registration successful!',
        })
    } 
    
    catch(error) {
        console.log(error);
        return res.status(200).json({
            success: false,
            message: error.message,
        })
    }
}

userController.loginUser = async (req , res) => {
    const { username, password } = req.body;
    try {   
        let twilioToken = await client.tokens.create();

        let loginUser = await User.findOne({ 
            username: username,
            password: password,
        });

        if(loginUser){
            return res.status(200).json({
                success: true,
                me: loginUser._id,
                myUsername: loginUser.username,
                theme: loginUser.theme,
                token: twilioToken,
                message: 'Logged in.',
            })
        }

        else {
            return res.status(200).json({
                success: false,
                message: 'Incorrect username or password.',
            })
        }
       
    } 

    catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

userController.getFriends = async (req, res) => {
    const { me } = req.body;
    try {
        let meDocument = await User.findById(me);
        let listOfFriendObjects = convertToClientFriendObjects(meDocument.friends);

        let onlineUsers = socketFunctions.getOnlineUsers();
        for (let friend of listOfFriendObjects){
            for (let onlineUser of onlineUsers){
                if (onlineUser == friend.friendId){
                    friend['online'] = true;
                    break;
                }
            }
            if (!friend['online']){
                friend['online'] = false;
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Friends got.',
            friends: listOfFriendObjects,
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

convertToClientFriendObjects = (friends) => {
    listOfFriendObjects = [];
    for (let friend of friends){
        let friendObject = {
            messageId: friend.messageId,
            friendId: friend.friendId,
            username: friend.username,
            avatarUrl: friend.avatarUrl
        }
        listOfFriendObjects.push(friendObject);
    }
    return listOfFriendObjects;
}

userController.getServers = async (req, res) => {
    const { me } = req.body;
    try {
        let meDocument = await User.findById(me);

        let listOfServerObjects = []

        for (let server of meDocument.servers){
            console.log(server);
            let serverDocument = await Server.findById(server.serverId);
            listOfServerObjects.push(convertToClientServerObjects(serverDocument));
        }

        return res.status(200).json({
            success: true,
            message: 'Servers got.',
            servers: listOfServerObjects,
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

convertToClientServerObjects = (server) => {
    server.serverId = server._id;
    return server;
}

userController.newFriend = async (req, res) => {
    try{
        const { newFriend, me } = req.body;
        
        let newFriendDocument = await User.findOne({ 
            username: newFriend,
        });

        if (!newFriendDocument) {
            return res.status(200).json({
                success: false,
                message: "User doesn't exist.",
            });
        }

        let newFriendID = newFriendDocument._id.toString();
        let newFriendUsername = newFriendDocument.username.toString();

        if (me == newFriendID) {
            return res.status(200).json({
                success: false,
                message: "You can't add yourself.",
            });
        };
        
        let meDocument = await User.findById(me);

        for (let friend of meDocument.friends){
            if(friend.friendId == newFriendID){
                return res.status(200).json({
                    success: false,
                    message: "You're already friends with this user.",
                });
            }
        }

        newMessageId = await messageController.createNewMessage([me, newFriendID]);

        if (!newMessageId){
            return res.status(200).json({
                success: false,
                message: "Error creating mutual message log between you and your new friend.",
            });
        }

        //updating friend into user's friend-list
        let newFriendEntry = {
            friendId: newFriendID,
            username: newFriendUsername,
            messageId: newMessageId,
            avatarUrl: newFriendDocument.avatarUrl
        }

        meDocument.friends.push(newFriendEntry);
        await meDocument.save();

        //updating user into the friend's friend-list
        let meAsFriend = {
            friendId: meDocument._id,
            username: meDocument.username,
            messageId: newMessageId,
            avatarUrl: meDocument.avatarUrl
        }

        newFriendDocument.friends.push(meAsFriend);
        await newFriendDocument.save();

        socketFunctions.refreshUsersFriends(newFriendID);

        return res.status(200).json({
            success: true,
            message: 'Friend added',
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

userController.lookUp = async (req, res) => {
    const { userInQuestion } = req.body;
    let userDocument = await User.findOne({
        _id: userInQuestion,
    })
    
    if (!userInQuestion) {
        return res.status(200).json({
            success: false,
            message: "User doesn't exist.",
         });
    }

    return userDocument;
}

userController.deleteFriend = async (req, res) => {
    //delete friend from user's friend list
    //delete user from friend's friend list
    //delete message document associated with friend

    const { me, friend, messageId } = req.body;
    try{
        let meDocument = await User.findById(me);
        let friendDocument = await User.findById(friend);

        let friends = meDocument.friends;
        meDocument.friends = friends.filter(friendObject => friendObject.friendId != friend);
        await meDocument.save();

        friends = friendDocument.friends;
        friendDocument.friends = friends.filter(friendObject => friendObject.friendId != me);
        await friendDocument.save();
        
        await Message.findByIdAndDelete(messageId);

        socketFunctions.refreshUsersFriends(me);
        socketFunctions.refreshUsersFriends(friend);

        return res.status(200).json({
            success: true,
            message: "Friend deleted"
        });
    }

    catch(error) {
        console.log(error);
        return res.status(200).json({
            success: false,
            message: error.message,
        });
    }
}

userController.uploadImage = async (req, res) => {
    const image = req.file;
    const me = req.params.id;
    
    const datauri = new Datauri();
    datauri.format('.jpeg', image.buffer);
    
    try{
        uploadResult = await cloudinary.uploader.upload(datauri.content, {});
        const urlForImage = uploadResult.secure_url;
        const [url1, url2] = urlForImage.split('upload');
        const croppedUrl = url1 + 'upload/h_200,w_200' + url2;
        
        let userDocument = await User.findById(me);
        
        userDocument.avatarUrl = croppedUrl.toString();
        await userDocument.save();
        for (let friend of userDocument.friends){
            // this query is bad for making this app scale to lots of users but is okay for here...
            // the solution is maybe to make another "friends model" where each document in it represents a connection between two users,
            // exactly like how messages works
            let friendDocument = await User.findById(friend.friendId);
            for (let friendOfFriend of friendDocument.friends){
                if (friendOfFriend.friendId == me){
                    friendOfFriend.avatarUrl = croppedUrl;
                    break;
                }
            }
            friendDocument.save();
            socketFunctions.refreshUsersFriends(friend.friendId);
        }
        return res.status(200).json({
            success: true,
            url: croppedUrl,
            message: "Avatar updated"
        });
    }
    catch(error){
        console.log(error);
        return res.status(200).json({
            success: false,
            message: "Error uploading image.",
        });
    }
}

userController.uploadServerImage = async (req, res) => {
    const image = req.file;
    const me = req.params.id;
    const serverId = req.params.serverId;
    
    const datauri = new Datauri();
    datauri.format('.jpeg', image.buffer);
    
    try{
        let serverDocument = await Server.findById(serverId);        
        if (serverDocument.ownerId != me){
            return res.status(200).json({
                success: false,
                message: "Contact the server owner to make this change.",
            });
        }

        uploadResult = await cloudinary.uploader.upload(datauri.content, {});
        const urlForImage = uploadResult.secure_url;
        const [url1, url2] = urlForImage.split('upload');
        const croppedUrl = url1 + 'upload/h_200,w_200' + url2;
        
        serverDocument.avatarUrl = croppedUrl.toString();
        await userDocument.save();

        for (let member of userDocument.friends){
            socketFunctions.refreshUsersServers(member.memberId);
        }

        return res.status(200).json({
            success: true,
            message: "Avatar updated"
        });
    }
    catch(error){
        console.log(error);
        return res.status(200).json({
            success: false,
            message: "Error uploading image.",
        });
    }
    
}

userController.updateTheme = async (req, res) => {
    const {me, theme} = req.body;

    try {
        let userDocument = await User.findById(me);

        userDocument.theme = theme;
        userDocument.save();

        return res.status(200).json({
            success: true,
            message: "Theme updated"
        });
    }
    catch(error){
        console.log(error);
        return res.status(200).json({
            success: false,
            message: "Error updating theme.",
         });
    }
}

module.exports = userController;
