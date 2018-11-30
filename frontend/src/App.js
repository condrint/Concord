import React, { Component } from 'react';
import Login from './Login.js';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
const axios = require('axios');

class App extends Component {
  constructor() {
    super();
    this.state = {
      form : "login",
      //login states
      loginUsernameInput : "",
      loginPasswordInput : "",
      isLoggedIn : false,
      //register states
      registerUsernameInput : "",
      registerPasswordInput : "",

    }
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this);
  }

  handleFormChange = event => {
    (this.state.form === "login") ? this.setState({form : "register"}) : this.setState({form : "login"});
  }
  
  //dynamic function that can handle changes for both login and register forms
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleRegisterSubmit = event => {
    event.preventDefault();
    let password = this.state.registerPasswordInput;
    let username = this.state.registerUsernameInput;
    if(!password || !username)
      alert("Invalid input");
    console.table(this.state);
    axios.post('/api/register', {
      "password" : password,
      "username" : username,
    });
  }

  handleLoginSubmit = event => {
    event.preventDefault();
    let password = this.state.loginPasswordInput;
    let username = this.state.loginUsernameInput;
    if(!password || !username)
      alert("Invalid input");
    console.table(this.state);
    axios.post('/api/login', {
      "password" : password,
      "username" : username,
    });
  }

  render() {
    return (    
      <div id="appWrapper">
        <Router>
          <div id='routesWrapper'>
            <Route path='/login' render = { () =>
              <Login 
                loginSubmit={this.handleLoginSubmit} 
                change={this.handleChange}
                loggedIn={this.state.isLoggedIn}
                loginUsernameInput={this.state.loginUsernameInput}
                loginPasswordInput={this.state.loginPasswordInput}
                registerPasswordInput={this.state.registerPasswordInput}
                registerUsernameInput={this.state.registerUsernameInput}
                registerSubmit={this.handleRegisterSubmit}
                formChange={this.handleFormChange}
                form={this.state.form}
              />}
            />
            <Route path='/main/:type/:id' component = { ({match}) =>
              <div id="mainWrapper">
                <div id="settingsWrapper">

                  Settings
                </div>
                <div id="friendsWrapper">

                  Friends
                </div>
                <div id="serverWrapper">

                  Server
                </div>
                <div id="dashboardWrapper">

                  {match.params.type}
                  {match.params.id}
                </div>
              </div>}
            />
          </div>
        </Router>
      </div>
    )
  }
}

export default App;
