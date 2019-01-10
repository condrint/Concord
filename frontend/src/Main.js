import React, { Component } from 'react';
import { Friends } from './Friends.js';
import { NewFriend } from './NewFriend.js';
//import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Main extends Component {
  constructor() {
    super();
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
          Server
          servers
          serv
          <br></br>
          ser
        </div>

        <div id="friends">
          Friends
          <Friends friends={this.props.friends}/> 
          <NewFriend showNewFriendPopup={this.props.showNewFriendPopup}/>
        </div>

        <div id="dashboard">
          {this.props.match.params.type}
          {this.props.match.params.id}
        </div>
      </div>
    )
  }
}


export default Main;