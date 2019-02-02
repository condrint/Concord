import React, { Component } from 'react';


 class Login extends Component {

    constructor(props) {
      super(props);
    }
    

    render(){
      if(this.props.form === "login"){
        return (
          <div>
            <div class="filler"></div>
            <form id="loginForm">
              <label class="header" for="loginUsernameInput">Username</label>
              <input class="form" id="loginUsernameInput" type="text" onChange={this.props.change} value={this.props.loginUsernameInput}/> 
              <label class="header" for="loginPasswordInput">Password</label>
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
            <div class="filler"></div>
            <form id="registerForm">
            <label class="header" for="registerUsernameInput">Username</label>
              <input class="form" id="registerUsernameInput" type="text" onChange={this.props.change} value={this.props.registerUsernameInput}/> 
              <label class="header" for="registerPasswordInput">Password</label>
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