import React, { Component } from 'react';
import Login from './Login.js';
import Main from './Main.js';
import  Popup  from './Popups.js';
import { BrowserRouter as Router, Route, Link, Redirect, Switch} from 'react-router-dom';
import io from 'socket.io-client';
const axios = require('axios');
const socket = io('http://localhost:3001');

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
      redirectId: '',

      // login 
      loginUsernameInput: '',
      loginPasswordInput: '',
      isLoggedIn : false, //keep as true for testing using npm run start

      // register
      registerUsernameInput: '',
      registerPasswordInput: '',
      
      // popups
      showNewFriendPopup: false,
      showServerPopup: false,
      newFriendInput: '',
      serverInput: '',

      // sending message
      sendMessageInput: '',

      // main
      friends: [],
      /* friends form ->
        {
          messageId,
          friendId,
          username
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
      currentlyViewedMessages: []
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
    
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
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
        alert(loginResult.data.message)
        this.setState({ 
          isLoggedIn: loginResult.data.success,
          me: loginResult.data.me,
          myUsername: loginResult.data.myUsername,
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
    console.log(' i got called ')
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
      'joinServer': joinServer,
      'me': me,
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
      'createServer': createServer,
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
    console.log('getFriends');

    let me = this.state.me;
    
    try{
      let friendsResult = await axios.post('/api/getFriends', {
        me: me
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
    console.log('getServers');

    let me = this.state.me;

    try{
      let serversResult = await axios.post('api/getServers', {
        me: me
      });

      if(serversResult.data.success){
        this.setState({
          servers = serversResult.data.servers
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
    console.log('redirect');
    let path = '/main/' + type + '/' +  ID;
    this.setState({
      redirect: true,
      redirectTo: path,
      redirectId: ID,
    })
  }

  sendMessage(type, messageId){
    console.log('sendMessage');
    if (type != 'server' && type != 'user'){
      alert("You can only send a message to a user or a server.")
      return;
    }

    let message = this.state.sendMessageInput;

    if(!message){
      alert("You can't send an empty message.");
      return;
    }

    socket.emit('messageToServer', {
      senderId: this.state.me,
      senderUsername: this.state.myUsername,
      message: message,
      messageId: messageId,
    })
  }

  updateCurrentlyViewedMessages(messageId){
    console.log('getCurrentlyViewedMessages');
    let currentMessages = this.state.messages;
    let currentlyViewedMessages = []
      
    for (let messageObject of currentMessages){
      if (messageObject.messageId == messageId){
        currentlyViewedMessages = messageObject.history;
      }
    }

    this.setState({
      currentlyViewedMessages: currentlyViewedMessages
    })
  }

  async getMessages (messageId){
    console.log('getMessages');
    let currentMessages = this.state.messages;
    for (let messageObject of currentMessages){
      if (messageObject.messageId == messageId){
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

  callUser(messageId){
    socket.emit('initiateCall', {
      initator: this.state.me,
      messageId: messageId,
    })
  }

  componentDidUpdate(){
    console.log('App did update called');
    // when redirect is true, the redirect component will change the URL and rerender the page
    // whenever we mount the app, we set redirect to false to prevent an infinite loop of redirects
    if (this.state.redirect){
      const chatRoomId = this.state.redirectId;
      this.getMessages(chatRoomId);
      this.setState({
        redirect: false,
        redirectTo: '',
        redirectId: '',
      });
    }
  }

  // declaring socket events 
  componentDidMount(){
    socket.on('messageToClient', (data) => {
      console.log('client received message')
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
      
      this.updateCurrentlyViewedMessages(messageId)
    })
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
              ))}/>

              {/* Main page */}
              <Route path="/main/:type/:id" render={({match}) =>
                this.state.isLoggedIn ? (
                  <div>
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
                    </div>
                    <div id="popupWrapper">
                      {this.state.showServerPopup &&
                        <Popup 
                          type={'Join/Create Server'}
                          change={this.handleChange} 
                          joinServerSubmit={this.joinServerSubmit}
                          createServerSubmit={this.createServerSubmit}  
                          serverInput={this.state.serverInput}
                        />
                      }
                    </div>

                    {/* Main content */}
                    <Main 
                      match={match} 

                      // button functions
                      showNewFriendPopup={this.showNewFriendPopup}
                      showServerPopup ={this.showServerPopup}
                      change={this.handleChange}
                      sendMessage={this.sendMessage}
                      redirect={this.redirect}
                      callUser={this.callUser}

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
                  404 - Page Not Found
                </div>
              </Route>

            </Switch>
          </div>
        </Router>

        <br></br>
        
        {/* Testing Buttons */}
        <button onClick={()=>{this.setState({haha:'hehe'}) /* update state to rerender component */}}>rerender component app.js</button>
        <button onClick={()=>{console.table(this.state)}}>log state</button>
      
      </div>
    )
  }
}

export default App;
