import React, { Component } from 'react';

class New_Friend extends Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      return(
        <div id="newFriendWrapper">
            <button onClick={this.props.showNewFriendPrompt}>
                <span>+</span>
            </button>
        </div>
      )
    }
  }


export default New_Friend;