import React, { Component } from 'react';

class Settings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
        <div>
            <div id="imageUpload">
                Avatar Image
                <input type="file" onChange={this.props.handleImageChange}/>
                <button onClick={this.props.uploadImage}>Upload</button>
            </div>
            <div id="themePicker">
                
            </div>
            <div id="serverManagement">

            </div>
        </div>
    )
  }
}

export { Settings };