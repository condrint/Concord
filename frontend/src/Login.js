import React, { Component } from 'react';


 class Login extends Component {

    constructor(props) {
      super(props);
    }
    

    render() {
      return (
        <div>
          <div id="loginWrapper">
            <form id = "loginForm" onSubmit={this.props.loginSubmit}>
              Username <br/>
              <input id="loginUsernameInput" type="text" onChange={this.props.loginChange} value={this.props.loginUsernameInput}/> <br/>
              Password <br/>
              <input id="loginPasswordInput" type="text" onChange={this.props.loginChange} value={this.props.loginPasswordInput}/>
              <br/>
              <button id="loginButton" type="submit">Login</button>
            </form>
          </div>
          <br/>
          <div id="registerWrapper">
            <form id = "registerForm" onSubmit={this.props.registerSubmit}>
              Username <br/>
              <input id="registerUsernameInput" type="text" onChange={this.props.registerChange} value={this.props.registerUsernameInput}/> <br/>
              Password <br/>
              <input id="registerPasswordInput" type="text" onChange={this.props.registerChange} value={this.props.registerPasswordInput}/>
              <br/>
              <button id="registerButton" type="submit">Register</button> 
            </form>
          </div>
        </div>
      );
    }
 }

 export default Login;