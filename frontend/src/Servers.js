import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Servers extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <ul>
        { this.props.servers && this.props.servers.map((server, index) => 
          <li key={index} onClick={() => {this.props.redirect('user', server.servername)}}> 
            <button>
              {server.servername}
            </button>
          </li>
        )}
      </ul>
    )
  }
}

export { Servers };