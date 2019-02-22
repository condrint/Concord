import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Friends extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <ul>
        { this.props.friends && this.props.friends.map((friend, index) => 
          <li key={index} onClick={() => {this.props.redirect('user', friend.messageId)}}> 
            <button>
              <img src={friend.avatarUrl}/>
              {friend.username}
            </button>
          </li>
        )}
      </ul>
    )
  }
}

export { Friends };