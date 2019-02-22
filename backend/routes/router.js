// ./express-server/routes/todo.server.route.js
const express = require('express');
//const multer = require('multer');
//const parser = multer({ storage: storage });
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

const userController = require('../controllers/user_controller');
const messageController = require('../controllers/message_controller');
const serverController = require('../controllers/server_controller');

const router = express();

router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.post('/newFriend', userController.newFriend);
router.post('/getFriends', userController.getFriends);
//router.post('/deletefriend', userController.deletefriend);
router.post('/uploadImage',  upload.single('image'), userController.uploadImage);

router.post('/getMessages', messageController.getMessages);

router.post('/createServer', serverController.createServer);
router.post('/joinServer', serverController.joinServer);
router.post('/getMembers', serverController.getMembers);
//router.post('/deleteServer', serverController.deleteServer);

module.exports = router;

