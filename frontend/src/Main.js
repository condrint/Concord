import React, { Component } from 'react';
import New_Friend from './New_Friend.js';
import Friends from './Friends.js';
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
          <New_Friend showNewFriendPrompt={this.props.showNewFriendPrompt}/>
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