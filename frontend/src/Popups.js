import React, { Component } from 'react';

class Popup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div id="popups">
        {this.props.type == 'New friend' &&
          <div id="newFriendPopup">
            <header>Add a new friend by username</header>
            <form id="newFriendForm">
              <input id="newFriendInput" type="text" onChange={this.props.change} value={this.props.newFriendInput}/>
              <button type="submit" onClick={this.props.newFriendSubmit}>Add</button>
            </form>
          </div>
        }

      </div>
    )
  }
}

export default Popup;
