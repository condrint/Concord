import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

 class Login extends Component
 {
    constructor(props)
    {
        super(props);
    }
    

    render()
    {
    
        return (
          <div className = "App">
          { this.props.loggedIn ? //if user is logged in
                <div>LOGGED IN</div>//TEMPORARY
            :            //Otherwise, if user is NOT logged in    
                <div>
                  <form id = "LoginForm" onSubmit={this.props.loginSubmit}>
                    <FormGroup controlId="username">
                      <ControlLabel>Username</ControlLabel>
                      <FormControl
                        autoFocus
                        type="username"
                        value={this.props.username}
                        onChange={this.props.loginChange}
                      />
                    </FormGroup>
                    <FormGroup controlId="password">
                      <ControlLabel>Password</ControlLabel>
                      <FormControl
                        value={this.props.password}
                        onChange={this.props.loginChange}
                        type="password"
                      />
                    </FormGroup>
                    <Button
                        block
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        Login
                    </Button>
                  </form>
                </div>
          }
          </div>
        );
    }
 }

 export default {Login};