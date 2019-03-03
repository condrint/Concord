import React, { Component } from 'react';

class Messages extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <ul id="messageList">
        { this.props.messages && this.props.messages.map((message, index) => 
          <li key={index}> 
            {message.senderUsername}: {message.message}
          </li>
        )}
      </ul>
    )
  }
}

export { Messages };