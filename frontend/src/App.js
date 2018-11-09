import React, { Component } from 'react';
import Login from './Login.js';
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

  handleLoginSubmit = event => {
    event.preventDefault();
    console.table(this.state);
    axios.post('/api/login', {
      loginUsernameInput,
      loginPasswordInput,
    });
  }

  handleRegisterSubmit = event => {
    event.preventDefault();
    let password = this.state.registerPasswordInput;
    let username = this.state.registerUsernameInput;
    if(!password || !username)
      alert("fuck you doin, bitch?");
    console.table(this.state);
    axios.post('/api/register', {
      registerUsernameInput,
      registerPasswordInput,
    });
  }

  render() {
    return (    
      <div id="appWrapper">
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
        />
      </div>
    )
  }
}

export default App;
