const Server = require('../models/server.js');
const messageController = require('../controllers/message_controller');

const serverController = {};

//userController.registerUser converted to createServer
serverController.createServer = async (req, res) => {
    const { serverName, ownerName } = req.body;
    const newServer = new Server({ serverName, ownerName });
    try {
        let createdServer = await newServer.save(); 
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



module.exports = serverController;