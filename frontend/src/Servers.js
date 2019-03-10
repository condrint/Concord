import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Servers extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <ul className="w3-animate-left">
        { this.props.servers && this.props.servers.map((server, index) => 
          <li className="icon" key={index} onClick={() => {this.props.redirect('server', server.messageId)}}> 
            <img src={server.avatarUrl}/>
            <div className="username">
              <div className="usernameBackground"></div>
              {server.serverName}
            </div>

            <button class="deleteButton" onClick={() => this.props.leaveServer(server._id)}>X</button>
          </li>
        )}
      </ul>
    )
  }
}

export { Servers };


