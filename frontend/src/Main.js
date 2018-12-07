import React, { Component } from 'react';
import { Friends } from './Friends.js';
import { NewFriend } from './NewFriend.js';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Main extends Component {
  constructor() {
    super();
  }

  render() {
    return(
      <div id="mainWrapper">
        <div id="settingsWrapper">
          Settings
        </div>

        <div id="friendsWrapper">
          Friends
          <Friends/>
          <NewFriend showNewFriendPopup={this.props.showNewFriendPopup}/>
        </div>

        <div id="serverWrapper">
          Server
        </div>

        <div id="dashboardWrapper">
          {this.props.match.params.type}
          {this.props.match.params.id}
        </div>
      </div>
    )
  }
}


export default Main;