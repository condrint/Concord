import React, { Component } from 'react';

class Messages extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <ul>
        { this.props.messages && this.props.messages.map((message, index) => 
          <li key={index}> 
            <ul>
              {message.senderUsername} : {message.message}
            </ul>
          </li>
        )}
      </ul>
    )
  }
}

export { Messages };