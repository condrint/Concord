import React, { Component } from 'react';


 class Login extends Component {

    constructor(props) {
      super(props);
    }
    

    render(){
      if(this.props.form === "login"){
        return (
          <div>
            <form id = "loginForm">
              <label for="loginUsernameInput">Username</label>
              <input id="loginUsernameInput" type="text" onChange={this.props.change} value={this.props.loginUsernameInput}/> 
              <label for="loginPasswordInput">Password</label>
              <input id="loginPasswordInput" type="password" onChange={this.props.change} value={this.props.loginPasswordInput}/>
              <button id="loginButton" type="submit" value="Submit" onClick={this.props.loginSubmit}>Login</button>
              <button type="button" onClick={this.props.formChange}>Click here to Register</button>
            </form>
            <br/>
          </div>
        );
      }
      else if(this.props.form === "register"){
        return (
        <div>
            <form id = "registerForm">
            <label for="registerUsernameInput">Username</label>
              <input id="registerUsernameInput" type="text" onChange={this.props.change} value={this.props.registerUsernameInput}/> 
              <label for="registerPasswordInput">Password</label>
              <input id="registerPasswordInput" type="password" onChange={this.props.change} value={this.props.registerPasswordInput}/>
              <button id="registerButton" type="submit" value="Submit" onClick={this.props.registerSubmit}>Register</button>
              <button type="button" onClick={this.props.formChange}>Click here to Login</button>
            </form>
          </div>
        );
      }
    }
  }

 export default Login;