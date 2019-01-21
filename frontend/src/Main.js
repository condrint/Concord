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
    return(
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
          {this.props.match.params.type}
          {this.props.match.params.id}
          <div id="sendMessageForm">
            <form>
              <input type="text" placeholder="Send a message!"/>
              <input type="submit" value="Send"/>
            </form>
          </div>

        </div>
      </div>
    )
  }
}


export default Main;