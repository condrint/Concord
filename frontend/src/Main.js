import React, { Component } from 'react';
import { Friends } from './Friends.js';
import { NewFriend } from './NewFriend.js';
import { Messages } from './Messages.js';


class Main extends Component {
  constructor(props) {
    super(props);
  }


  componentDidMount(){
    this.props.getFriends();
  }


  render() {
    let urlType = this.props.match.params.type;
    let urlMessageId = this.props.match.params.id;

    return (
      <div id="main">
        <div id ="nonscalablemain">
          <div class="settings">
          settings
          </div>
          <div class="friends">
            Friends
            <Friends friends={this.props.friends} redirect={this.props.redirect}/> 
            <NewFriend showNewFriendPopup={this.props.showNewFriendPopup}/>
          </div>
        </div>
        <div id = "scalablemain">
          <div class="servers">
            servers
          </div>

          <div class="dashboard">
          dashboard
            {/* don't add html below the sendMessageForm - this comment 
            can be removed when this fact is more obvious in the future*/}

          {(urlType == 'user' || urlType == 'server') && 
          <div id="chat">
            <Messages messages={this.props.messages}/>
            <div id="sendMessageForm">
                <input id="sendMessageInput" onChange={this.props.change} type="text" placeholder="Send a message!"/>
                <button onClick={() => this.props.sendMessage(urlType, urlMessageId)}> Send </button>
                {(urlType == 'user' &&
                  <button onClick={() => this.props.callUser(urlMessageId)}> Call </button>
            )}
              </div>
            </div>
          }
          </div>
        </div>
      </div>
    )
  }
}


export default Main;