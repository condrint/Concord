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
          <li class="icon" key={index} onClick={() => {this.props.redirect('user', friend.messageId)}}> 
            
              <img className={friend.online ? 'online friendImg' : 'offline friendImg'} src={friend.avatarUrl}/>
              <div class="username">
                <div class="usernameBackground"></div>
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