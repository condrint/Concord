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
                <input type="file" onChange={this.props.handleImageChange}/>
                <button className="buttonW" onClick={this.props.uploadImage}>Upload</button>
            </div>

            <div id="themePicker">
                <h1>Theme</h1>
                <div class="switch-toggle switch-candy" id="switch2">
                  <input id="default" name="view" type="radio" checked={this.props.theme == 1}/>
                  <label for="default" onClick={() => this.props.changeTheme(1)}>Default</label>

                  <input id="Tsunami" name="view" type="radio" checked={this.props.theme == 2}/>
                  <label for="Tsunami" onClick={() => this.props.changeTheme(2)}>Tsunami</label>

                  <input id="Blaze" name="view" type="radio" checked={this.props.theme == 3}/>
                  <label for="Blaze" onClick={() => this.props.changeTheme(3)}>Blaze</label>
                  <a className="switchColor"></a>
                </div>
            </div>

            <div id="serverManagement">
                <h1>Server Management</h1>
                <h2>Owned servers appear here</h2>
            </div>
        </div>
    )
  }
}

export { Settings };