const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes/router');
const app = express();
const server = require('http').Server(app);
const socketIo = require('socket.io')(server, { origins: '*:*'});
const messageController = require('./controllers/message_controller');

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
mongoose.connect('mongodb://localhost/')
.then(res => console.log("Connected to DB"))
.catch(err => console.log(err));

// connect api to router
app.use('/api', router);
app.get('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname,'../frontend/build/index.html'));
});

// chat events - this should be in a seperate file ideally
socketIo.on('connection', function(socket){

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
        socket.emit('messageToClient', {
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
});