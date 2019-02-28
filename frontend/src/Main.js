import React, { Component } from 'react';
import { Friends } from './Friends.js';
import { Servers } from './Servers.js';
import { NewFriend } from './NewFriend.js';
import { CreateJoinServer } from './NewServer';
import { Messages } from './Messages.js';
import { Settings } from './Settings.js';


class Main extends Component {
  constructor(props) {
    super(props);
  }


  componentDidMount(){
    this.props.getFriends();
    //this.props.getServers();
  }


  render() {
    let urlType = this.props.match.params.type;
    let urlMessageId = this.props.match.params.id;

    return (
      <div id="main">
        <div id="leftColumn">

          <div id="settings">
            <button className="buttonW" onClick={() => this.props.redirect('settings', 'me')}> Settings </button>

            <div>
              {/* This.props.server.map 
                    <input> ban user
                    <upload image> 
              */}
            </div>
          </div>

          <div id="iconsWrapper">
            <button className="buttonW" onClick={this.props.handleToggleIcons}>Friends / Servers</button>
            {this.props.toggleIcons ? (
              <div id="servers">
                <Servers servers={this.props.servers} redirect={this.props.redirect}/>
                <CreateJoinServer showServerPopup ={this.props.showServerPopup}/>
              </div>
            ) : (
              <div id="friends">
                <Friends friends={this.props.friends} redirect={this.props.redirect} deleteFriend={this.props.deleteFriend}/> 
                <NewFriend showNewFriendPopup={this.props.showNewFriendPopup}/>
              </div>
            )}
          </div>
        </div>

        <div id="dashboard">

          {(urlType == 'settings') && 
            <div id="settings">
              <Settings handleImageChange={this.props.handleImageChange} uploadImage={this.props.uploadImage} image={this.props.image}/>
            </div>
          }

          {(urlType == 'user' || urlType == 'server') && 
            <div id="chat">
              <Messages messages={this.props.messages}/>
              <div id="sendMessageForm">

                <input id="sendMessageInput" onChange={this.props.change} value={this.props.sendMessageInput} type="text" placeholder="Send a message!"/>
                <button className="buttonW" onClick={() => this.props.sendMessage(urlType, urlMessageId)}> Send </button>
                
                {(urlType == 'user' &&
                  <div>
                    <button className="buttonW" onClick={() => this.props.callUser(urlMessageId, 'voice')}> Voice Call </button>
                    <button className="buttonW" onClick={() => this.props.callUser(urlMessageId, 'video')}> Video Call </button>
                  </div>
                )}

              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}


export default Main;