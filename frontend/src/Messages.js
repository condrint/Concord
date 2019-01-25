import React, { Component } from 'react';

class Messages extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <ul>
        { this.props.messages && this.props.messages.map((message, index) => 
            'hi'
            /*
          <li key={index} onClick={() => {this.props.redirect('user', friend.chatId)}}> 
            <button>
              {friend.username}
            </button>
          </li>*/
        )}
      </ul>
    )
  }
}

export { Messages };