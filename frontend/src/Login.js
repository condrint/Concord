import React, { Component } from 'react';


 class Login extends Component {

    constructor(props) {
      super(props);
    }
    

<<<<<<< HEAD
    render()
    {
      if(this.props.form === "login")
      {
        return (
          <div>
            <div>
              <form id = "loginForm" onSubmit={this.props.loginSubmit}>
                Username <br/>
                <input id="loginUsernameInput" type="text" onChange={this.props.change} value={this.props.loginUsernameInput}/> <br/>
                Password <br/>
                <input id="loginPasswordInput" type="password" onChange={this.props.change} value={this.props.loginPasswordInput}/>
                <br/>
                <button id="loginButton" type="submit" value="Submit">Login</button>
                <button id="changeForm" onClick={this.props.formChange} value="Submit" type="click">Click here to Register</button>
              </form>
            </div>
            <br/>
          </div>
        );
      }
      else if(this.props.form === "register")
      {
        return (
        <div>
=======
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
>>>>>>> bfadf8dd47a94d507c4d27c18db0c892fa76fa05
            <form id = "registerForm" onSubmit={this.props.registerSubmit}>
              Username <br/>
              <input id="registerUsernameInput" type="text" onChange={this.props.change} value={this.props.registerUsernameInput}/> <br/>
              Password <br/>
              <input id="registerPasswordInput" type="password" onChange={this.props.change} value={this.props.registerPasswordInput}/>
              <br/>
<<<<<<< HEAD
              <button id="loginButton" type="submit" value="Submit">Register</button>
              <button id="changeForm" onClick={this.props.formChange} value="Submit" type="click">Click here to Login</button>
            </form>
          </div>
        );
      }
=======
              <button id="registerButton" type="submit">Register</button>
            </form>
          </div>
        </div>
      );
>>>>>>> bfadf8dd47a94d507c4d27c18db0c892fa76fa05
    }
 }

 export default Login;