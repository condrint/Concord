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
              <input id="username" type="text" onChange={this.props.loginChange}/> <br/>
              Password <br/>
              <input id="password" type="text"  onChange={this.props.loginChange}/>
              <br/>
              <button id="loginButton" type="submit">Login</button>
            </form>
          </div>
        );
    }
 }

 export default Login;