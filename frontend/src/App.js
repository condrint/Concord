import React, { Component } from 'react';
import Login from './Login.js';
import Main from './Main.js';
import Popup  from './Popups.js';
import Voice from './Voice.js';
import Video from './Video.js';
import { BrowserRouter as Router, Route, Link, Redirect, Switch} from 'react-router-dom';
import io from 'socket.io-client';
//import './Login.css';
const axios = require('axios');


//for deploy
const socket = io();

class App extends Component {
  constructor() {
    super();
    this.state = {
      // multiple use & misc
      form: 'login',
      me: '',
      myUsername: '',
      redirect: false,
      redirectTo: '',
      redirectType: '',
      redirectId: '',

      // login 
      loginUsernameInput: '',
      loginPasswordInput: '',
      isLoggedIn: true, //keep as true for testing using npm run start

      // register
      registerUsernameInput: '',
      registerPasswordInput: '',
      
      // popups
      showNewFriendPopup: false,
      showServerPopup: false,
      showCallPopup: false,
      newFriendInput: '',
      serverInput: '',

      // sending message
      sendMessageInput: '',

      // main
      toggleIcons: true,
      friends: [],
      /* friends form ->
        {
          messageId,
          friendId,
          username,
          avatarUrl,
          online
        }
       */
      servers: [],
      messages: [], 
      /* messages form ->
        {
          messageId,
          history: [{
            senderId: String,
            senderUsername: String, 
            message: String,
            time: { type : Date } // default: Date.now 
          }]
        }
      */
      currentlyViewedMessages: [],
      currentlyViewedMessagesId: '',
      image: null,


      // calls
      inCall: false,
      callParticipant: '',
      callMessageId: '',
      isInitiator: false,
      peerConnectInfo: {},
      callType: '', //video or voice
      token: {},
    }
    
    this.handleLoginFormChange = this.handleLoginFormChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.newFriendSubmit = this.newFriendSubmit.bind(this);
    this.createServerSubmit = this.createServerSubmit.bind(this);
    this.joinServerSubmit = this.joinServerSubmit.bind(this);

    this.showNewFriendPopup = this.showNewFriendPopup.bind(this);
    this.hideNewFriendPopup = this.hideNewFriendPopup.bind(this);
    this.showServerPopup = this.showServerPopup.bind(this);
    this.hideServerPopup = this.hideServerPopup.bind(this);

    this.getFriends = this.getFriends.bind(this);
    this.getServers = this.getServers.bind(this);
    this.redirect = this.redirect.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.clearUsernameAndPasswordFields = this.clearUsernameAndPasswordFields.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.updateCurrentlyViewedMessages = this.updateCurrentlyViewedMessages.bind(this);
    this.callUser = this.callUser.bind(this);
    this.callPermissionResponse = this.callPermissionResponse.bind(this);
    this.sendDataToReceiver = this.sendDataToReceiver.bind(this);
    this.removeConnectInfo = this.removeConnectInfo.bind(this);
    this.endCall = this.endCall.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.toggleIcons = this.toggleIcons.bind(this);
    this.deleteFriend = this.deleteFriend.bind(this);
    this.loadTestData = this.loadTestData.bind(this);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleImageChange = (event) => {
    event.preventDefault();
    this.setState({
      image: event.target.files[0]
    });
  }

  uploadImage = async () => {
    const image = this.state.image;

    if (!image){
      alert('No image selected.');
      return;
    }

    if (image.size > 100 * 1000){
      alert('Image is too large. It must be smaller than 100KB');
      return;
    }
    
    const formData = new FormData()
    formData.append('image', image);

    const url = '/api/uploadImage/' + this.state.me + '/'

    try{
      let uploadImageResult = await axios.post(
        url, 
        formData,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (uploadImageResult.data.success){
        alert(uploadImageResult.data.message);
      }
      else{
        alert(uploadImageResult.data.message);
      }
    }

    catch (error) {
      alert(error)
    }

    this.setState({
      image: null
    })
  }

  handleRegisterSubmit = async (event) => {
    event.preventDefault();
    let password = this.state.registerPasswordInput;
    let username = this.state.registerUsernameInput;
    if(!password || !username){
      alert('Invalid input');
      return;
    }

    this.clearUsernameAndPasswordFields();

    try {
      let registerResult = await axios.post('/api/register', {
        'username': username,
        'password': password,
      });
      if (registerResult.data.success){
        alert(registerResult.data.message)
        this.handleLoginFormChange();
      }
      else{
        alert(registerResult.data.message);
      }
    }
    catch(error){
      alert(error);
    }
  }

  handleLoginSubmit = async (event) => {
    event.preventDefault();
    let password = this.state.loginPasswordInput;
    let username = this.state.loginUsernameInput;
    if(!password || !username){
      alert('Invalid input');
      return;
    }

    this.clearUsernameAndPasswordFields();

    try {
      let loginResult = await axios.post('/api/login', {
        'username': username,
        'password': password,
      });
      if (loginResult.data.success) {
        this.setState({ 
          isLoggedIn: loginResult.data.success,
          me: loginResult.data.me,
          myUsername: loginResult.data.myUsername,
          token: loginResult.data.token,
        });
        
        socket.emit('newClient', {
          id: loginResult.data.me
        });
      }
      else{
        alert(loginResult.data.message);
      }
    } catch(error) {
        alert(error);
    }
  }

  
  handleLoginFormChange(){
    (this.state.form === 'login') ? this.setState({form : 'register'}) : this.setState({form : 'login'});
  }
  
  clearUsernameAndPasswordFields(){
    this.setState({
      registerPasswordInput: '',
      registerUsernameInput: '',
      loginUsernameInput: '',
      loginPasswordInput: '',
    })
  }

  newFriendSubmit = async (event) => {
    event.preventDefault();
    let newFriend = this.state.newFriendInput;
    let me = this.state.me;

    if (!newFriend){
      alert('Invalid Input');
      return;
    }

    try {
      let newFriendResult = await axios.post('/api/newFriend', {
        'newFriend': newFriend,
        'me': me,
      });
      if (newFriendResult.data.success) {
        this.getFriends();
        alert(newFriendResult.data.message);
      }
      else {
        alert(newFriendResult.data.message);
      }
    } catch (error) {
        alert(error);
    }
    this.hideNewFriendPopup();
  }

  joinServerSubmit = async (event) =>{
  event.preventDefault();
  let joinServer = this.state.serverInput;
  let me = this.state.me;
  
  if(!joinServer){
    alert('Invalid Input');
    return;
  }

  try {
    let joinServerResult = await axios.post('/api/joinServer', {
      'server': joinServer,
      'newMember': me,
    });
    if(joinServerResult.data.success){
      this.getServers();
      alert(joinServerResult.data.message)
    }
    else{
      alert(joinServerResult.data.message)
    }
  } catch (error) {
    alert(error);
  }
  this.hideServerPopup();
  }

  createServerSubmit = async (event) =>{
  event.preventDefault();
  let createServer = this.state.serverInput;
  let me = this.state.me;
  
  if(!createServer){
    alert('Invalid Input');
    return;
  }

  try {
    let createServerResult = await axios.post('/api/createServer', {
      'serverName': createServer,
      'me': me,
    });
    if(createServerResult.data.success){
      this.getServers();
      alert(createServerResult.data.message)
    }
    else{
      alert(createServerResult.data.message)
    }
  } catch (error) {
    alert(error);
  }
  this.hideServerPopup();
  }

  showNewFriendPopup(){
    this.setState({ 
      showNewFriendPopup: true,
      newFriendInput: '',
    });
  }

  hideNewFriendPopup(){
    this.setState({ 
      showNewFriendPopup: false,
      newFriendInput: '',
    });
  }
  
  showServerPopup(){
    this.setState({ 
      showServerPopup: true,
      serverInput: '',
    });
  }

  hideServerPopup(){
    this.setState({ 
      showServerPopup: false,
      serverInput: '',
    });
  }

  async getFriends(){
    let me = this.state.me;
    
    try{
      let friendsResult = await axios.post('/api/getFriends', {
        me: me,
      });

      if (friendsResult.data.success){
        this.setState({
          friends: friendsResult.data.friends
        });
      }
      else {
        alert(friendsResult.data.message);
      }
    }
    catch (error) {
      alert(error);
    }
  }

  async getServers(){

    let me = this.state.me;

    try{
      let serversResult = await axios.post('api/getServers', {
        me: me
      });

      if(serversResult.data.success){
        this.setState({
          servers: serversResult.data.servers
        });
      }
      else{
        alert(serversResult.data.message);
      }
    }
    catch(error){
      alert(error);
    }
  }

  redirect(type, ID){
    let path = '/main/' + type + '/' +  ID;
    this.setState({
      redirect: true,
      redirectTo: path,
      redirectType: type,
      redirectId: ID,
    })
  }

  sendMessage(event, type, messageId){
    event.preventDefault();

    if (type != 'server' && type != 'user'){
      alert("You can only send a message to a user or a server.")
      return;
    }

    let message = this.state.sendMessageInput;

    if(!message){
      alert("You can't send an empty message.");
      return;
    }

    this.setState({
      sendMessageInput: '',
    });

    socket.emit('messageToServer', {
      senderId: this.state.me,
      senderUsername: this.state.myUsername,
      message: message,
      messageId: messageId,
    })
  }

  updateCurrentlyViewedMessages(messageId){
    let currentMessages = this.state.messages;
    let currentlyViewedMessages = []
      
    for (let messageObject of currentMessages){
      if (messageObject.messageId == messageId){
        currentlyViewedMessages = messageObject.history;
      }
    }

    this.setState({
      currentlyViewedMessages: currentlyViewedMessages,
      currentlyViewedMessagesId: messageId
    })
  }

  async getMessages (messageId){
    let currentMessages = this.state.messages;
    for (let messageObject of currentMessages){
      if (messageObject.messageId == messageId){
        this.updateCurrentlyViewedMessages(messageId);
        return;
      }
    }

    try{
      let messagesResult = await axios.post('/api/getMessages', {
        messageId: messageId
      });

      if (messagesResult.data.success){
        let currentMessages = this.state.messages
        currentMessages.push(messagesResult.data.messageObject)

        this.setState({
          messages: currentMessages
        });

        this.updateCurrentlyViewedMessages(messageId);
      }
      else {
        alert(messagesResult.data.message);
      }
    }
    catch (error) {
      alert(error);
    }
  }

  callUser(messageId, type){
    if (this.state.inCall){
      alert('End your current call before starting a new one.');
      return;
    }

    let friends = this.state.friends;
    for (let friend of friends){
      if (friend.messageId == messageId){
        if(!friend.online){
          alert(friend.username + ' is offline. Try calling later.');
          return;
        }
        break;
      }
    }

    socket.emit('initiateCall', {
      initiator: this.state.me,
      messageId: messageId,
      type: type,
    })
    this.setState({
      isInitiator: true,
      callType: type
    })
  }

  endCall(){
    this.setState({
      inCall: false,
      callParticipant: '',
      callMessageId: '',
      isInitiator: false,
      peerConnectInfo: {},
      callType: '',
    });
  }

  callPermissionResponse(permission){
    this.setState({
      showCallPopup: false,
    })

    socket.emit('callPermissionResult', {
      permission: permission,
      initiator: this.state.callParticipant,
      receiver: this.state.me,
      messageId: this.state.callMessageId,
    })
  }

  sendDataToReceiver(data){
    socket.emit('peerConnectInfoFromInitiator', {
      callParticipant: this.state.callParticipant,
      peerConnectInfo: data
    })
  }

  removeConnectInfo(){
    this.setState({
      peerConnectInfo: '',
    })
  }

  toggleIcons(){
    this.setState({
      toggleIcons: !this.state.toggleIcons
    });
  }

  async deleteFriend(friendId, messageId){
    let me = this.state.me;

    try {
      let deleteFriendResult = await axios.post('/api/deleteFriend', {
        'friend': friendId,
        'me': me,
        'messageId': messageId
      });
      if (deleteFriendResult.data.success) {
        this.redirect('dashboard', 'me');
        alert(deleteFriendResult.data.message);
      }
      else {
        alert(deleteFriendResult.data.message);
      }
    } catch (error) {
        alert(error);
    }
  }

  loadTestData(){
    this.setState({
      friends: [
        {
          avatarUrl: "https://res.cloudinary.com/hu51ij26o/image/upload/w_400,h_400,c_crop,g_face,r_max/w_200/v1550456252/ioivickyj0denrhwj2wp.jpg",
          friendId: "5c6a4d655172f200043bc5b5",
          messageId: "5c6a4d8b5172f200043bc5bb",
          online: false,
          username: "p",
        },
        {
          avatarUrl: "https://res.cloudinary.com/hu51ij26o/image/upload/h_200,w_200/v1550456252/ioivickyj0denrhwj2wp.jpg",
          friendId: "5c747a65a4b9dd000462767c",
          messageId: "5c747a76a4b9dd000462767e",
          online: false,
          username: ";",
        }
      ]
    });
  }

  componentDidUpdate(){
    // when redirect is true, the redirect component will change the URL and rerender the page
    // whenever we mount the app, we set redirect to false to prevent an infinite loop of redirects
    if (this.state.redirect && (this.state.redirectType == 'server' || this.state.redirectType == 'user')){
      const chatRoomId = this.state.redirectId;
      this.getMessages(chatRoomId);

      let scroll = document.getElementById('messageList');
      if (scroll){
        scroll.scrollTop = scroll.scrollHeight;
      }

      this.setState({
        redirect: false,
        redirectTo: '',
        redirectType: '',
        redirectId: '',
      });
    }
  }

  componentDidMount(){
    socket.on('messageToClient', (data) => {
      let messageId = data.messageId;
      let newMessage = data.message;
      let currentMessages = this.state.messages;
      
      for (let messageHistoryObject of currentMessages){
        if (messageHistoryObject.messageId == messageId){
          messageHistoryObject.history.push(newMessage);
        }
      }

      this.setState({
        messages: currentMessages
      })

      let scroll = document.getElementById('messageList');
      if (scroll){
        scroll.scrollTop = scroll.scrollHeight;
      }

      if (messageId == this.state.currentlyViewedMessagesId){
        this.updateCurrentlyViewedMessages(messageId)
      }
    });

    socket.on('refreshFriends', () => {
      this.getFriends();
    });

    socket.on('callPermission', (data) => {
      const initiator = data.initiator;
      const messageId = data.messageId;

      this.setState({
        showCallPopup: true,
        callParticipant: initiator,
        callType: data.type,
        callMessageId: messageId,
      });
    });

    socket.on('deniedCall', (data) => {
      // this check should Not be needed in the future
      if (data.initiator == this.state.me){
        alert('User denied call');
      }
      this.endCall();
    });

    socket.on('startCall', (data) => {
      let [firstParticipant, secondParticipant] = data.participants;
      let me = this.state.me;

      console.log(data.participants, me);

      if (firstParticipant == me){
        console.log('first one');
          this.setState({
            inCall: true,
            callParticipant: secondParticipant,
            callMessageId: data.messageId
          });
      }
      else if (secondParticipant == me){
          console.log('second one');
          this.setState({
            inCall: true,
            callParticipant: firstParticipant,
            callMessageId: data.messageId
          });
      }
      else {
        this.endCall();
      }
    });

    socket.on('messageToClientError', (data) => {
      alert(data.error);
    });

    socket.on('peerConnectInfoToReceiver', (data) => {
      this.setState({
        peerConnectInfo: data.peerConnectInfo
      })
    });

    socket.on('userOnlineStatus', (data) => {
      let friends = this.state.friends;
      let user = data.newUser;
      let onlineStatus = data.onlineStatus;

      for (let friend of friends){
        if (friend.friendId == user){
          friend['online'] = onlineStatus;
          break;
        }
      }

      this.setState({
        friends: friends
      });
    });
  }

  render() {
    return (    
      <div id="appWrapper">
        <Router>
          <div id="routesWrapper">
            { this.state.redirect && 
              <div id="redirect">
                <Redirect push to={this.state.redirectTo}/>
              </div>
            }
            <Switch>

              {/* Login and register page */}
              <Route exact path="/login" render={() => (
                this.state.isLoggedIn ? (
                  <Redirect to="/main/dashboard/me"/>
                ) : (
                  <div id="loginPage">
                    <Login 
                      change={this.handleChange}
                      loginUsernameInput={this.state.loginUsernameInput}
                      loginPasswordInput={this.state.loginPasswordInput}
                      registerPasswordInput={this.state.registerPasswordInput}
                      registerUsernameInput={this.state.registerUsernameInput}
                  
                      registerSubmit={this.handleRegisterSubmit}
                      loginSubmit={this.handleLoginSubmit} 
                  
                      formChange={this.handleLoginFormChange}
                      form={this.state.form}
                    />
                  </div>
              ))}/>

              {/* Main page */}
              <Route path="/main/:type/:id" render={({match}) =>
                this.state.isLoggedIn ? (
                  <div id="content">

                    {/* Pop ups */}
                    <div id="popupWrapper">
                      {this.state.showNewFriendPopup &&
                        <Popup 
                          type={'New friend'}
                          change={this.handleChange} 
                          newFriendSubmit={this.newFriendSubmit} 
                          newFriendInput={this.state.newFriendInput}
                        />
                      }
                      {this.state.showServerPopup &&
                        <Popup 
                          type={'New Server'}
                          change={this.handleChange} 
                          joinServerSubmit={this.joinServerSubmit}
                          createServerSubmit={this.createServerSubmit}  
                          serverInput={this.state.serverInput}
                        />
                      }
                      {this.state.showCallPopup &&
                        <Popup 
                          type={'New Call'}
                          callPermissionResponse={this.callPermissionResponse}
                        />
                      }
                    </div>

                    {/* Chat */}
                    {this.state.inCall && 
                       this.state.callType == 'voice' &&
                          <div id="voiceWrapper">
                            <audio id="voiceChat" controls/>
                            <Voice 
                              callParticipant={this.state.callParticipant}
                              callMessageId={this.state.callMessageId}
                              isInitiator={this.state.isInitiator}
                              peerConnectInfo={this.state.peerConnectInfo}
                              sendDataToReceiver={this.sendDataToReceiver}
                              removeConnectInfo={this.removeConnectInfo}
                              endCall={this.endCall}
                              token={this.state.token}
                            />
                          </div>
                    }

                    {this.state.inCall && 
                       this.state.callType == 'video' &&
                       <div id="videoWrapper">
                        <video id="videoChat" controls/>
                        <Video 
                          callParticipant={this.state.callParticipant}
                          callMessageId={this.state.callMessageId}
                          isInitiator={this.state.isInitiator}
                          peerConnectInfo={this.state.peerConnectInfo}
                          sendDataToReceiver={this.sendDataToReceiver}
                          removeConnectInfo={this.removeConnectInfo}
                          endCall={this.endCall}
                          token={this.state.token}
                        />
                        </div>
                    }

                    {/* Main content */}
                    <Main 
                      match={match} 

                      // button functions
                      showNewFriendPopup={this.showNewFriendPopup}
                      showServerPopup ={this.showServerPopup}
                      change={this.handleChange}
                      sendMessage={this.sendMessage}
                      sendMessageInput={this.state.sendMessageInput}
                      redirect={this.redirect}
                      callUser={this.callUser}
                      handleImageChange={this.handleImageChange}
                      uploadImage={this.uploadImage}
                      image={this.state.image}
                      toggleIcons={this.state.toggleIcons}
                      handleToggleIcons={this.toggleIcons}   
                      deleteFriend={this.deleteFriend}                   

                      // content
                      getFriends={this.getFriends}
                      getServers={this.getServers}
                      friends={this.state.friends}
                      servers={this.state.servers}
                      messages={this.state.currentlyViewedMessages}
                    />

                  </div>
                ) : (
                  <Redirect to="/login"/>
              )}/>         

              <Route>
                <div id="404">
                  <Redirect to="/login"/>
                </div>
              </Route>

            </Switch>
          </div>
        </Router>

        {/* Testing Buttons */}
        <button className="test" onClick={()=>{this.setState({haha:'hehe'}) /* update state to rerender component */}}>rerender component app.js</button>
        <button id="test1" className="test" onClick={()=>{console.table(this.state)}}>log state</button>
        <button className="test" onClick={()=>{this.loadTestData()}}>load test state</button>
      
      </div>
    )
  }
}

export default App;
