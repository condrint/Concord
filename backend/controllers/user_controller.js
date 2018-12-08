var User = require('../models/user.js');

const userController = {};

userController.registerUser = async (req , res) => {
    const {username, password} = req.body;
    const newUser = new User({username, password});
    try {
        let registeredUser = await newUser.save();
        return res.status(201).json({
            success: true
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
        })
    } catch(error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

userController.newFriend = async(req, res) => {
    const { newFriend, me } = req.body;
    try{
        let newFriendDocument = await User.find({ 
            username: newFriend,
         });

        let addFriendToMe = await User.updateOne(
            { _id: me },
            { $push: {
                friends:{
                    id: newFriendDocument._id,
                    history:[]
                }
            }}
        );

        return res.status(201).json({
            success: true,
        })
        
         console.table(newFriendDocument);
         console.log(newFriendDocument);

    } catch(error) {
        console.log(error)
        return res.status(500).send(error);
    }
    

}
module.exports = userController;
