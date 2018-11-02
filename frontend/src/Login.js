import React, { Component } from 'react';


 class Login extends Component {

    constructor(props) {
        super(props);
    }
    

    render()
    {
        return (
          <div>
            <form id = "loginForm" onSubmit={this.props.loginSubmit}>
              Username <br/>
              <input id="loginUsernameInput" type="text" onChange={this.props.loginChange} value={this.props.loginUsernameInput}/> <br/>
              Password <br/>
              <input id="loginPasswordInput" type="text" onChange={this.props.loginChange} value={this.props.loginPasswordInput}/>
              <br/>
              <button id="loginButton" type="submit" value="Submit">Login</button>
            </form>
          </div>
        );
    }
 }

 export default Login;