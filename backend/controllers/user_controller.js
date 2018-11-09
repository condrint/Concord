const userController = {};

userController.registerUser = (req , res) => {
    console.log('Registered success');
}

userController.loginUser = (req , res) => {
    console.log('Login success');
}

module.exports = userController;