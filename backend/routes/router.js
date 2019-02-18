const express = require('express');
var multer  = require('multer');
var upload = multer();

const userController = require('../controllers/user_controller');
const messageController = require('../controllers/message_controller');
const serverController = require('../controllers/server_controller');

const router = express();

router.post('/login', userController.loginUser);
router.post('/register', userController.registerUser);
router.post('/newFriend', userController.newFriend);
router.post('/getFriends', userController.getFriends);
router.post('/uploadImage/:id',  upload.single('image'), userController.uploadImage);

router.post('/getMessages', messageController.getMessages);

router.post('/createServer', serverController.createServer);
router.post('/joinServer', serverController.joinServer);
router.post('/getMembers', serverController.getMembers);

module.exports = router;

