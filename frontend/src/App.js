import React, { Component } from 'react';
import Login from './Login.js';
import Main from './Main.js';
import  Popup  from './Popups.js';
import { BrowserRouter as Router, Route, Link, Redirect, Switch} from 'react-router-dom';
const axios = require('axios');

class App extends Component {
  constructor() {
    super();
    this.state = {
      // multiple use & misc.
      form: 'login',
      me: '',
      redirect: false,
      redirectTo: '',

      // login 
      loginUsernameInput: '',
      loginPasswordInput: '',
      isLoggedIn : false, //keep as true for testing using npm run start

      // register
      registerUsernameInput: '',
      registerPasswordInput: '',
      
      // popups
      showNewFriendPopup: false,
      newFriendInput: '',

      // sending message
      sendMessageInput: '',

      // main
      friends: [],
      servers: [],
    }
    
    this.handleLoginFormChange = this.handleLoginFormChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.clearUsernameAndPasswordFields = this.clearUsernameAndPasswordFields.bind(this);
    this.showNewFriendPopup = this.showNewFriendPopup.bind(this);
    this.hideNewFriendPopup = this.hideNewFriendPopup.bind(this);
    this.newFriendSubmit = this.newFriendSubmit.bind(this);
    this.getFriends = this.getFriends.bind(this);
    this.redirect = this.redirect.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
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
  
  async getFriends(){
    let me = this.state.me;
    
    try{
      let friendsResult = await axios.post('/api/getFriends', {
        'me': me
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

  
  redirect(type, ID){
    let path = '/main/' + type + '/' +  ID;
    this.setState({
      redirect: true,
      redirectTo: path
    })
  }

  sendMessage(type, messageId){
    console.log(type, messageId);
    if (type != 'server' && type != 'user'){
      alert("You can only send a message to a user or a server - this isn't your fault.")
      return;
    }
    
    // event.preventDefault();
    let message = this.state.sendMessageInput;
    if(!message){
      alert("You can't send an empty message");
      return;
    }
    alert("sending " + message + " to " + messageId);
    return;

    /*
    try {
      let sendMessageResult = await axios.post('/api/login', {
        'username': username,
        'password': password,
      });
      if (loginResult.data.success) {
        alert(loginResult.data.message)
        this.setState({ 
          isLoggedIn: loginResult.data.success,
          me: loginResult.data.me,
        });
      }
      else{
        alert(loginResult.data.message);
      }
    } catch(error) {
        alert(error);
    }*/

  }

  componentDidMount(){
    // when redirect is true, the redirect component will change the URL and rerender the page
    // whenever we mount the app, we set redirect to false to prevent an infinite loop of redirects
    this.setState({
      redirect: false,
      redirectTo: '',
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
                    loginSubmit={this.handleLoginSubmit} 
                    change={this.handleChange}
                    loggedIn={this.state.isLoggedIn}
                    loginUsernameInput={this.state.loginUsernameInput}
                    loginPasswordInput={this.state.loginPasswordInput}
                    registerPasswordInput={this.state.registerPasswordInput}
                    registerUsernameInput={this.state.registerUsernameInput}
                    registerSubmit={this.handleRegisterSubmit}
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

                    {/* Main content */}
                    <Main 
                      match={match} 

                      // button functions
                      showNewFriendPopup={this.showNewFriendPopup}
                      change={this.change}
                      sendMessage={this.sendMessage}
                      redirect={this.redirect}

                      // content
                      getFriends={this.getFriends}
                      friends={this.state.friends}
                      servers={this.state.servers}
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
