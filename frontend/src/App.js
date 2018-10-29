import React, { Component } from 'react';
import Login from './Login.js';
class App extends Component {
  constructor()
  {
    super();
    this.state = {
      username :"",
      password : "",
      isLoggedIn : false,
    }
  }
  validateForm()
    {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    handleLoginChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleLoginSubmit = event => {
        event.preventDefault();
    }
  render() {
    let loggedIn = this.state.isLoggedIn;
    let username = this.state.username;
    let password = this.state.password;
    return (    
      <div id="appWrapper">
        <Login 
          loginSubmit={this.props.handleLoginSubmit} 
          loginChange={this.props.handleLoginChange}
          loggedIn={loggedIn}
          username={username}
          password={password}
        />
      </div>
    )
  }
}

export default App;
