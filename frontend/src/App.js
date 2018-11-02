import React, { Component } from 'react';
import Login from './Login.js';
class App extends Component {
  constructor() {
    super();
    this.state = {
      loginUsernameInput :"",
      loginPasswordInput : "",
      isLoggedIn : false,
    }
    this.handleLoginChange = this.handleLoginChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
  }
  
  handleLoginChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleLoginSubmit = event => {
    event.preventDefault();
    console.table(this.state);
  }

  render() {
    let loggedIn = this.state.isLoggedIn;
    let loginUsernameInput = this.state.loginUsernameInput;
    let loginPasswordInput = this.state.loginPasswordInput;
    return (    
      <div id="appWrapper">
        <Login 
          loginSubmit={this.handleLoginSubmit} 
          loginChange={this.handleLoginChange}
          loggedIn={loggedIn}
          loginUsernameInput={loginUsernameInput}
          loginPasswordInput={loginPasswordInput}
        />
      </div>
    )
  }
}

export default App;
