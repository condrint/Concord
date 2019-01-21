import React, { Component } from 'react';
import { Friends } from './Friends.js';
import { NewFriend } from './NewFriend.js';
//import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Main extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.props.getFriends();
  }

  render() {
    const urlType = this.props.match.params.type;
    const urlMessageId = this.props.match.params.id;

    return (
      <div id="main">
        <div id="settings">
          Settings
        </div>

        <div id="servers">
          servers
        </div>

        <div id="friends">
          Friends
          <Friends friends={this.props.friends} redirect={this.props.redirect}/> 
          <NewFriend showNewFriendPopup={this.props.showNewFriendPopup}/>
        </div>

        <div id="dashboard">

          {/* don't add html below the sendMessageForm - this comment 
            can be removed when this fact is more obvious in the future*/}

          {(urlType == 'user' || urlType == 'server') && 
            <div id="sendMessageForm">
              <input id="sendMessageInput" onChange={this.props.change} type="text" placeholder="Send a message!"/>
              <button onClick={() => this.props.sendMessage(urlType, urlMessageId)}> Send </button>
            </div>
          }
        </div>
      </div>
    )
  }
}


export default Main;