import React, { Component } from 'react';
let Peer = require('simple-peer')



class Voice extends Component {
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
      this.startVoiceStream();
    });
    
    peer.on('stream', stream => {
       let audioNode = document.getElementById('voiceChat');
       audioNode.srcObject = stream;
    });

    peer.on('data', data => {
      console.log(data.toString());
      if (data.toString() === 'destroy'){
        this.props.endCall();
        peer.destroy();
      }
    });

    this.startVoiceStream = this.startVoiceStream.bind(this);
  }

  startVoiceStream = async () => {
    let audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    this.state.peer.addStream(audioStream);
  }

  componentDidUpdate(){
    if(this.props.peerConnectInfo){
      this.state.peer.signal(this.props.peerConnectInfo)
      this.props.removeConnectInfo(); 
    }
  }

  componentWillUnmount(){
    this.state.peer.send('destroy')
    this.state.peer.destroy();
  }

  render() {
    return(
        <div id="voice">
            <button className="buttonW" onClick={this.props.endCall}>End call</button>
        </div>
    )
  }
}

export default Voice;