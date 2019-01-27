const User = require('../models/user.js');
const messageController = require('../controllers/message_controller');

const userController = {};

userController.registerUser = async (req, res) => {
    const {username, password} = req.body;
    const newUser = new User({username, password});
    try {
        let registeredUser = await newUser.save(); 
        return res.status(201).json({
            success: true,
            message: 'Registration successful!',
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

userController.loginUser = async (req , res) => {
    const {username, password} = req.body;
    try {
        let loginUser = await User.findOne({ 
            username: username,
            password: password,
        });

        if(loginUser){
            return res.status(200).json({
                success: true,
                me: loginUser._id,
                myUsername: loginUser.username,
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
    const {me} = req.body;
    try {
        let meDocument = await User.findById(me);
        
        let listOfFriendObjects = convertToClientFriendObjects(meDocument.friends);

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
    listOfFriendObjects = []
    for (let friend of friends){
        let friendObject = {
            chatId: friend.chatId,
            friendId: friend.friendId,
            username: friend.username
        }
        listOfFriendObjects.push(friendObject);
    }
    return listOfFriendObjects;
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

        let meDocument = await User.findOne({
            _id: me,
        });
        
        for (let friend of meDocument.friends){
            if(friend._id == newFriendID){
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
            chatId: newMessageId
        }

        meDocument.friends.push(newFriendEntry);
        meDocument.save();

        //updating user into the friend's friend-list
        let meAsFriend = {
            friendId: meDocument._id,
            username: meDocument.username,
            chatId: newMessageId
        }

        newFriendDocument.friends.push(meAsFriend);
        newFriendDocument.save();

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

module.exports = userController;
