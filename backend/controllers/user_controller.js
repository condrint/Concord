var User = require('../models/user.js');

const userController = {};

userController.registerUser = async (req , res) => {
    const {username, password} = req.body;
    const newUser = new User({username, password});
    
    try {
        let newUser = await newUser.save();
        res.status(201).send({
            success: true
        })

    } catch(error) {
        res.status(500).send(error)
    }
}

userController.loginUser = (req , res) => {
    console.log('Login success');
}

module.exports = userController;
