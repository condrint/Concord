import React, { Component } from 'react';

class NewFriend extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div id="newFriendWrapper">
        <button onClick={this.props.showNewFriendPopup}>
          <span>+</span>
        </button>
      </div>
    )
  }
}

export { NewFriend };