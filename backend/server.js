const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes/router');
const app = express();
const server = require('http').Server(app);
const socketIo = require('socket.io')(server, { origins: '*:*'});
const messageController = require('./controllers/message_controller');
/*
const User = require('../backend/models/user.js');
const Server = require('../backend/models/server.js');
const Message = require('../backend/models/message.js');
User.remove({}, function(err) { 
  console.log('User collection removed') 
});
Server.remove({}, function(err) { 
  console.log('Server collection removed') 
});
Message.remove({}, function(err) { 
  console.log('Message collection removed') 
});*/

// configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.set('views', path.join(__dirname, '../frontend/build')); 
app.use(express.static(path.join(__dirname, '../frontend/build'))); 
app.set('view engine', 'ejs');

const port = process.env.PORT || 3001;

// start the server
server.listen(port, () => {
  console.log(`App Server Listening at ${port}`);
});

// connect to database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/')
.then(res => console.log("Connected to DB"))
.catch(err => console.log(err));

// connect api to router
app.use('/api', router);
app.get('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname,'../frontend/build/index.html'));
});

// chat events - this should be in a seperate file ideally
let clients = {}

socketIo.on('connection', function(socket){

  socket.on('newClient', (data) => {
    const clientId = data.id;
    clients[clientId] = socket.id;
  });

  socket.on('messageToServer', async (data) => {
    const message = data.message;
    const senderId = data.senderId;
    const senderUsername = data.senderUsername;
    const messageId = data.messageId;

    try {
      console.log('new message');/*
      if(socket.adapter.rooms.indexOf(chatRoom) == -1){
        await socket.join(chatRoom);
      }*/
      const messageEntry = await messageController.addMessage(senderId, senderUsername, message, messageId);
      
      if (!messageEntry){
        socket.emit('messageToClientError', {
          error: 'Could not add message to database.',
        });
      }
      else{
        console.log('trying to emit to client');
        const chatRoom = messageId;
        socketIo.emit('messageToClient', {
          message: messageEntry,
          messageId: messageId,
        });
      }
    }

    catch(error){
      socket.emit('messageToClientError', {
        error: error,
      });
    }
  });

  socket.on('initiateCall', async (data) => {
    const initiator = data.initiator;
    const messageIdToLookupReceiver = data.messageId;

    // look up receiver by seeing the other userId with the associated messageId
    // this 100% could be avoided by smarter clientside code
    try {
      console.log('new call');

      const receiver = await messageController.findOtherParticipant(messageIdToLookupReceiver, initiator);
      
      if (!receiver){
        socket.emit('messageToClientError', {
          error: 'Could not call user.',
        });
      }
      else{
        console.log('trying to call client');
        socketIo.emit('callPermission', {
          initiator: initiator,
          receiver: receiver,
          messageId: messageIdToLookupReceiver
        });
      }
    }

    catch(error){
      console.log(error)
      socket.emit('messageToClientError', {
        error: error.message,
      });
    }


  })

  socket.on('callPermissionResult', async (data) => {
    const permission = data.permission;
    const initiator = data.initiator;
    const receiver = data.receiver;
    const messageId = data.messageId;

    if (permission){
      socketIo.emit('startCall', {
        participants: [initiator, receiver],
        messageId: messageId
      })
    }
    else{
      socketIo.emit('deniedCall', {
        initiator: initiator
      })
    }
  })

  socket.on('peerConnectInfoFromInitiator', (data) => {
    socketIo.emit('peerConnectInfoToReceiver', {
      callParticipant: data.callParticipant,
      peerConnectInfo: data.peerConnectInfo,
    });
  })
});