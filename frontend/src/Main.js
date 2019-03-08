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
    this.props.getServers();
  }


  render() {
    let urlType = this.props.match.params.type;
    let urlMessageId = this.props.match.params.id;

    return (
      <div id="main">
        <div id="leftColumn">

          <div>
            <button className="buttonW"  id="settingsButton" onClick={() => this.props.redirect('settings', 'me')}> Settings </button>
          </div>

          <div id="iconsWrapper">

            <label class="switch-light switch-candy" >
              <input type="checkbox"/>
              <span id="switch" onClick={this.props.handleToggleIcons}>
                <span>Servers</span>
                <span>Friends</span>
                <a className="switchColor"></a>
              </span>
            </label>



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
              <Settings me={this.props.me} handleServerImageChange={this.props.handleServerImageChange} uploadServerImage={this.props.uploadServerImage} deleteServer={this.props.deleteServer} theme={this.props.theme} handleImageChange={this.props.handleImageChange} uploadImage={this.props.uploadImage} image={this.props.image} changeTheme={this.props.changeTheme} servers={this.props.servers}/>
            </div>
          }

          {(urlType == 'user' || urlType == 'server') && 
            <div id="chat">
              <Messages messages={this.props.messages}/>
              <div id="sendMessageForm">
                <form>
                  <input id="sendMessageInput" onChange={this.props.change} value={this.props.sendMessageInput} type="text" placeholder="Send a message!"/>
                  <button type="submit" className="buttonW messageButton" onClick={(event) => this.props.sendMessage(event, urlType, urlMessageId)}> Send </button>
                  {(urlType == 'user' &&
                    <span>
                      <button className="buttonW messageButton" onClick={(event) => this.props.callUser(event, urlMessageId, 'voice')}> Voice Call </button>
                      <button className="buttonW messageButton" onClick={(event) => this.props.callUser(event, urlMessageId, 'video')}> Video Call </button>
                    </span>
                  )}
                </form>

              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}


export default Main;