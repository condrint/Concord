import React, { Component } from 'react';
import Login from './Login.js';
import Main from './Main.js';
import  Popup  from './Popups.js';
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';
const axios = require('axios');

class App extends Component {
  constructor() {
    super();
    this.state = {
      form: 'login',
      me: '',

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
    }
    this.handleLoginFormChange = this.handleLoginFormChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.showNewFriendPopup = this.showNewFriendPopup.bind(this);
    this.hideNewFriendPopup = this.hideNewFriendPopup.bind(this);
    this.newFriendSubmit = this.newFriendSubmit.bind(this);
  }


  // login / register functions
  handleLoginFormChange = (event) => {
    event.preventDefault();
    (this.state.form === 'login') ? this.setState({form : 'register'}) : this.setState({form : 'login'});
  }
  
  // dynamic function that can handle changes for both login and register forms
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
    try {
      let registerResult = await axios.post('/api/register', {
        'username': username,
        'password': password,
      });
      if (registerResult.data.success)
         return this.handleLoginFormChange();
      else{
        alert('register problem')
      }
    }
    catch(e){
      alert(e);
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
    try {
      let loginResult = await axios.post('/api/login', {
        'username': username,
        'password': password,
      });
      if (loginResult.data.success) {
        this.setState({ 
          isLoggedIn: loginResult.data.success,
          me: loginResult.data.me,
        });
      }
      else{
        alert('login problem')
      }
    } catch(e) {
      alert(e);
    }
  }

  showNewFriendPopup(){
    this.setState({ showNewFriendPopup: !this.state.showNewFriendPopup }); //remove toggle functionality eventually, its convienent now
  }

  hideNewFriendPopup(){
    this.setState({ showNewFriendPopup: false });
  }

  newFriendSubmit = async (event) => {
    event.preventDefault();
    let newFriend = this.state.newFriendInput;
    let me = this.state.me;
    if (!newFriend){
      alert('Invalid Input');
    }
    try {
      let newFriendResult = await axios.post('/api/newFriend', {
        'newFriend': newFriend,
        'me': me,
      });
      if (newFriendResult.data.success) {
        alert('friend added');
        this.hideNewFriendPopup;
      }
      else{
        alert('login problem')
      }
    } catch(e) {
      alert(e);
    }
  }

  render() {
    return (    
      <div id="appWrapper">
        <Router>
          <div id="routesWrapper">

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
              )
            )}/>

            {/* Main page */}
            <Route path="/main/:type/:id" render={({match}) =>
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
                />

                <button onClick={()=>{this.setState({haha:'hehe'}) /* update state to rerender component */}}>rerender component</button>
              </div>
            }/>
            
          </div>
        </Router>
      </div>
    )
  }
}

export default App;
