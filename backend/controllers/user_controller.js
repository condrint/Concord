var User = require('../models/user.js');

const userController = {};

userController.registerUser = async (req , res) => {
    const {username, password} = req.body;
    const newUser = new User({username, password});
    console.log('attempting to register')
    try {
        let registeredUser = await newUser.save();
        return res.status(201).json({
            success: true
        })

    } catch(error) {
        console.log(error)
        return res.status(500).send(error)
    }
}

userController.loginUser = async (req , res) => {
  
        const {username, password} = req.body;
        console.log('attempting to login')
        try {
            let loginUser = await User.find({ 
                username: username,
                password: password,
             });
            return res.status(200).json({
                success: true,
                me: loginUser.username,

            })
    
        } catch(error) {
            console.log(error)
            return res.status(500).send(error)
        }
}

module.exports = userController;
