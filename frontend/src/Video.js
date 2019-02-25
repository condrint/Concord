import React, { Component } from 'react';
let Peer = require('simple-peer')

class Video extends Component {
  constructor(props) {
    super(props);

    this.state = {
      peer: new Peer({ 
        channelName: this.props.callMessageId,
        config: { 
          iceServers: [{ 
            url: 'turn:global.turn.twilio.com:3478?transport=udp',
            username: this.props.token.username,
            credential: this.props.token.password
          }]
        },
        initiator: this.props.isInitiator,
      }),
    }
    
    let peer = this.state.peer;

    peer.on('signal', data => {
      this.props.sendDataToReceiver(data);
    })

    peer.on('connect', () => {
      this.startVideoStream();
    });
    
    peer.on('stream', stream => {
       let videoNode = document.getElementById('videoChat');
       videoNode.srcObject = stream;
    });

    peer.on('data', data => {
      if (data.toString() === 'destroy'){
        this.props.endCall();
        peer.destroy();
      }
    });

    this.startVideoStream = this.startVideoStream.bind(this);
  }

  startVideoStream = async () => {
    let audioStream = await navigator.mediaDevices.getUserMedia({ video: true })
    this.state.peer.addStream(audioStream);
  }

  componentDidUpdate(){
    if(this.props.peerConnectInfo){
      this.state.peer.signal(this.props.peerConnectInfo)
      this.props.removeConnectInfo(); 
    }
  }

  componentWillUnmount(){
    try{
        this.state.peer.send('destroy')
        this.state.peer.destroy();
    }
    catch(error){
        return;
    }
  }

  render() {
    return(
        <div id="Video">
            <h1>Talking to {this.props.callParticipant}</h1>
            <button onClick={this.props.endCall}>End call</button>
        </div>
    )
  }
}

export default Video;