const socketFunctions = require('../server.js');
const User = require('../models/user.js');
const messageController = require('../controllers/message_controller');
const Message = require('../models/message.js');
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

        let listOfServerObjects = convertToClientServerObjects(meDocument.servers);

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

convertToClientServerObjects = (servers) => {
    listOfServerObjects = []
    for (let server of servers){
        let serverObject = {
            servername: server.servername,
        }
        listOfServerObjects.push(serverObject);
    }
    return listOfServerObjects;
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

    const { me, friend } = req.body;
    try{
        let meDocument = await User.findOne({
            _id: me
        });

        let friendDocument = await User.findOne({
            _id: friend
        });

        let meToBeDeleted = {
            friendId: '',
            username: '',
            messageId: '',
            avatarUrl: '',
        }

        let friendToBeDeleted = {
            friendId: '',
            username: '',
            messageId: '',
            avatarUrl: '',
        }

        for (let friend of meDocument.friends){
            if(friend.friendId == friendDocument._id){
                friendToBeDeleted = {
                    friendId: friend.friendId,
                    username: friend.username,
                    messageId: friend.messageId,
                    avatarUrl: friend.avatarUrl,
                }
                
            }
        }

        for (let friend of friendDocument.friends){
            if(friend.friendId == meDocument._id){
                meToBeDeleted = {
                    friendId: friend.friendId,
                    username: friend.username,
                    messageId: friend.messageId,
                    avatarUrl: friend.avatarUrl,
                }
                
            }
        }

        let messageDocument = await Message.findOne({
            _id: friendToBeDeleted.messageId
        });

        await meDocument.friends.pull(friendToBeDeleted);
        await friendDocument.friends.pull(meToBeDeleted);
        await meDocument.save();
        await friendDocument.save();
        await Message.remove(messageDocument);

        socketFunctions.refreshUsersFriends(friendDocument._id);
        socketFunctions.refreshUsersFriends(meDocument._id);

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
        console.log(croppedUrl);
        for (let friend of userDocument.friends){
            // this query is bad for making this app scale to lots of users but is okay for here...
            // the solution is maybe to make another "friends model" where each document in it represents a connection between two users,
            // exactly like how messages works
            let friendDocument = await User.findById(friend.friendId);
            for (let friendOfFriend of friendDocument.friends){
                if (friendOfFriend.friendId == me){
                    friendOfFriend.avatarUrl = croppedUrl;
                    console.log(friendDocument)
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

module.exports = userController;
