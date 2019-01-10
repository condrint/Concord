import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Friends extends Component {
  constructor(props) {
    super(props);
    this.redirect = this.redirect.bind(this);
  }

  redirect(friendID){
    let path = '/main/friend' + friendID;
    return <Redirect to={path}/>
  }

  render() {
    return(
      <ul>
        { this.props.friends && this.props.friends.map((friend, index) => 
          <li key={index} onClick={() => {this.redirect(friend._id)}}> 
            <button>
              {friend.username}
            </button>
          </li>
        )}
      </ul>
    )
  }
}

export { Friends };