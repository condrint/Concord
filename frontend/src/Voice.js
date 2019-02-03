import React, { Component } from 'react';
//let Peer = require('simple-peer')

class Voice extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount(){
    let audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    /*let peer = new Peer({ 
        stream: audioStream,
        channelName: this.props.callMessageId
     });

     peer.on('stream', stream => {
        console.log('received stream starting')
        let audioNode = document.getElementById('voiceChat');
        audioNode.src = window.URL.createObjectURL(stream)
     })*/
     
  }

  render() {
    return(
        <div id="voice">
            <h1>Taling to {this.props.callParticipant}</h1>
        </div>
    )
  }
}

export default Voice;