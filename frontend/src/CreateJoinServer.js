import React, { Component } from 'react';

class CreateJoinServer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div id="createJoinServerWrapper">
        <button onClick={this.props.showServerPopup}>
          <span>+</span>
        </button>
      </div>
    )
  }
}

export { CreateJoinServer };