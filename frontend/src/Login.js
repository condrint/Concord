import React, { Component } from 'react';


 class Login extends Component {

    constructor(props) {
      super(props);
    }
    

    render(){
      if(this.props.form === "login"){
        return (
          <div>
            <form id = "loginForm" onSubmit={this.props.loginSubmit}>
              Username <br/>
              <input id="loginUsernameInput" type="text" onChange={this.props.change} value={this.props.loginUsernameInput}/> <br/>
              Password <br/>
              <input id="loginPasswordInput" type="password" onChange={this.props.change} value={this.props.loginPasswordInput}/>
              <br/>
              <button id="loginButton" type="submit" value="Submit">Login</button>
              <br/>
              <button id="changeForm" onClick={this.props.formChange} value="Submit" type="click">Click here to Register</button>
            </form>
            <br/>
          </div>
        );
      }
      else if(this.props.form === "register"){
        return (
        <div>
            <form id = "registerForm" onSubmit={this.props.registerSubmit}>
              Username <br/>
              <input id="registerUsernameInput" type="text" onChange={this.props.change} value={this.props.registerUsernameInput}/> <br/>
              Password <br/>
              <input id="registerPasswordInput" type="password" onChange={this.props.change} value={this.props.registerPasswordInput}/>
              <br/>
              <button id="loginButton" type="submit" value="Submit">Register</button>
              <br/>
              <button id="changeForm" onClick={this.props.formChange} value="Submit" type="click">Click here to Login</button>
            </form>
          </div>
        );
      }
    }
  }

 export default Login;