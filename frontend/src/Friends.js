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
          <li class="icon" style={{backgroundColor: friend.online ? 'green' : 'red'}} key={index} onClick={() => {this.props.redirect('user', friend.messageId)}}> 
            <div>
              <img src={friend.avatarUrl}/>
              {friend.username}
            </div>
            <button class="deleteButton" onClick={() => this.props.deleteFriend(friend.friendId, friend.messageId)}>X</button>
          </li>
        )}
      </ul>
    )
  }
}

export { Friends };