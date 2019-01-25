import React, { Component } from 'react';
import { Friends } from './Friends.js';
import { NewFriend } from './NewFriend.js';
import { Messages } from './Messages.js';
var messages;

class Main extends Component {
  constructor(props) {
    super(props);

    this.getMessages = this.getMessages.bind(this);
  }

  componentDidMount(){
    this.props.getFriends();

    const urlType = this.props.match.params.type;
    const urlMessageId = this.props.match.params.id;
    this.getMessages(urlType, urlMessageId);
  }

  getMessages(urlType, urlMessageId){
    const allMessages = this.props.messages;

    //try to find messages in current list of messages
    for (var messageCandidate of allMessages){
      if (messageCandidate._id == urlMessageId){
        messages = messageCandidate;
        return
      }
      
    }

    //otherwise request message list from server
  }

  render() {
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
            <div id="chat">
              <Messages/>
              <div id="sendMessageForm">
                <input id="sendMessageInput" onChange={this.props.change} type="text" placeholder="Send a message!"/>
                <button onClick={() => this.props.sendMessage(urlType, urlMessageId)}> Send </button>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}


export default Main;