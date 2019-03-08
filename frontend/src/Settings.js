import React, { Component } from 'react';

class Settings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
        <div>
            <div id="imageUpload">
                <h1>Avatar Image</h1>
                <input id="imageInput" type="file" onChange={this.props.handleImageChange}/>
                <button className="buttonW" onClick={this.props.uploadImage}>Upload</button>
            </div>

            <div id="themePicker">
                <h1>Theme</h1>
                <div class="switch-toggle switch-candy" id="switch2">
                  <input id="default" name="view" type="radio" checked={this.props.theme == 1}/>
                  <label for="default" onClick={() => this.props.changeTheme(1)}>Default</label>

                  <input id="Ocean" name="view" type="radio" checked={this.props.theme == 2}/>
                  <label for="Ocean" onClick={() => this.props.changeTheme(2)}>Ocean</label>

                  <input id="Blaze" name="view" type="radio" checked={this.props.theme == 3}/>
                  <label for="Blaze" onClick={() => this.props.changeTheme(3)}>Blaze</label>
                  <a className="switchColor"></a>
                </div>
            </div>

            <div id="serverManagement">
                <h1>Server Management</h1>
                <h2>Owned servers appear here</h2>
                <div id="serverManagementList" className="w3-animate-left">

                  { this.props.servers && this.props.servers.filter(server => server.ownerId == this.props.me).map((server, index) => 
                    <div className="serverManagementRow" key={index}> 
                      <h2>{server.serverName}</h2>
                      <button onClick={this.props.deleteServer(server.serverId, server.messageId)}> Delete Server </button>
                      <input id="serverImageInput" type="file" onChange={this.props.handleServerImageChange}/>
                      <button className="buttonW" onClick={this.props.uploadServerImage(server.serverId)}>Upload</button>
                    </div>
                  )}

                </div>
            </div>
        </div>
    )
  }
}

export { Settings };