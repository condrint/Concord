var User = require('../models/user.js');

const userController = {};

userController.registerUser = async (req , res) => {
    const {username, password} = req.body;
    const newUser = new User({username, password});
    try {
        let registeredUser = await newUser.save();
        return res.status(201).json({
            success: true,
            message: '',
        })

    } catch(error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

userController.loginUser = async (req , res) => {
    const {username, password} = req.body;
    try {
        let loginUser = await User.find({ 
            username: username,
            password: password,
        });
        return res.status(200).json({
            success: true,
            me: loginUser._id,
            message: '',
        })
    } catch(error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

userController.newFriend = async(req, res) => {
    try{
        const { newFriendUsername, me } = req.body;
        let newFriendDocument = await User.find({ 
            username: newFriendUsername,
        });
        
        let newFriendID = newFriendDocument._id;

        let addFriendToMe = await User.find({
            _id: me,
        })

        for (let friend of addFriendToMe.friends){
            if(friend._id == newFriendID){
                return res.status(304).json({
                    success: false,
                    message: "You're already friends with this user.",
                });
            }
        }

        let newFriend = {
            id: newFriendID,
            history: [],
        }

        addFriendToMe.friends.push(newFriend);
        addFriendToMe.save();
        /*
        let addFriendToMe = await User.updateOne(
            { _id: me },
            { $push: {
                friends:{
                    id: newFriendDocument._id,
                    history:[]
                }
            }}
        );*/
        return res.status(201).json({
            success: true,
            message: '',
        })
        
    } catch(error) {
        console.log(error)
        return res.status(500).send(error);
    }
    

}
module.exports = userController;
