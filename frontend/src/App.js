import React, { Component } from 'react';
import Login from './Login.js';
import Main from './Main.js';
import { BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";
const axios = require('axios');

class App extends Component {
  constructor() {
    super();
    this.state = {
      form : "login",
      me: '',

      //login states
      loginUsernameInput : '',
      loginPasswordInput : '',
      isLoggedIn : true,
      //register states
      registerUsernameInput : '',
      registerPasswordInput : '',

    }
    this.handleLoginFormChange = this.handleLoginFormChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
    this.showNewFriendPrompt = this.showNewFriendPrompt.bind(this);
  }

  handleLoginFormChange = (event) => {
    event.preventDefault();
    (this.state.form === 'login') ? this.setState({form : 'register'}) : this.setState({form : 'login'});
  }
  
  //dynamic function that can handle changes for both login and register forms
  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleRegisterSubmit = async (event) => {
    event.preventDefault();
    let password = this.state.registerPasswordInput;
    let username = this.state.registerUsernameInput;
    if(!password || !username)
      alert('Invalid input');
    console.table(this.state);
    try {
      let registerResult = await axios.post('/api/register', {
        'username': username,
        'password': password,
      });
      if (registerResult.data.success)
         return this.handleFormChange();
    }
    catch(e){
      console.log(e);
    }
  }

  handleLoginSubmit = async (event) => {
    event.preventDefault();
    let password = this.state.loginPasswordInput;
    let username = this.state.loginUsernameInput;
    if(!password || !username)
      alert('Invalid input');
    console.table(this.state);
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
    } catch(e) {
      console.error(e);
    }
  }

  showNewFriendPrompt (){
    alert('new friend')
  }

  render() {
    return (    
      <div id="appWrapper">
        <Router>
          <div id="routesWrapper">
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
            <Route path="/main/:type/:id" render={({match}) =>
              <div>
                <Main 
                  match={match} 
                  showNewFriendPrompt={this.showNewFriendPrompt}
                />
                <button onClick={()=>{this.setState({haha:'hehe'})}}/>
              </div>
            }/>
          </div>
        </Router>
      </div>
    )
  }
}

export default App;
