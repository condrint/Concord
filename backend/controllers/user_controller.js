var User = require('../models/user.js');

const userController = {};

userController.registerUser = (req , res) => {
    const {username, password} = req.body;
    const newUser = new User({username, password});
    newUser.save(function(err){
        if(err) return console.error(err);
        console.log(newUser.username + " saved to User collection with password: " + newUser.password);
        })
    //console.log(newUser.username + " saved to User collection with password: " + newUser.password);
}

userController.loginUser = (req , res) => {
    console.log('Login success');
}

module.exports = userController;
