import React, { Component } from 'react';


 class Login extends Component {

    constructor(props) {
      super(props);
    }
    

    render() {
      if(this.props.form === "login"){
        return (
          <div>
            <form id="loginForm">
              <div class="header">Sign in</div>
              <div class="subheader">to Concord</div>
              <label class="label" for="loginUsernameInput">Username</label>
              <input class="form" id="loginUsernameInput" type="text" onChange={this.props.change} value={this.props.loginUsernameInput}/> 
              <label class="label" for="loginPasswordInput">Password</label>
              <input class="form" id="loginPasswordInput" type="password" onChange={this.props.change} value={this.props.loginPasswordInput}/>
              <button class="button" id="loginButton" type="submit" value="Submit" onClick={this.props.loginSubmit}>Login</button>
              <button class="button" type="button" onClick={this.props.formChange}>Click here to Register</button>
            </form>
            <br/>
          </div>
        );
      }
      else if(this.props.form === "register"){
        return (
        <div>
            <form id="registerForm">
            <div class="header">Register</div>
            <div class="subheader">an account with Concord</div>
            <label class="label" for="registerUsernameInput">Username</label>
              <input class="form" id="registerUsernameInput" type="text" onChange={this.props.change} value={this.props.registerUsernameInput}/> 
              <label class="label" for="registerPasswordInput">Password</label>
              <input class="form" id="registerPasswordInput" type="password" onChange={this.props.change} value={this.props.registerPasswordInput}/>
              <button class="button" id="registerButton" type="submit" value="Submit" onClick={this.props.registerSubmit}>Register</button>
              <button class="button" type="button" onClick={this.props.formChange}>Click here to Login</button>
            </form>
          </div>
        );
      }
    }
  }

 export default Login;