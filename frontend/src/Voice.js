import React, { Component } from 'react';
let Peer = require('simple-peer')



class Voice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      peer: new Peer({ 
        //stream: audioStream,
        channelName: this.props.callMessageId,
        initiator: this.props.isInitiator,
      }),
    }
    
    //
    let peer = this.state.peer;
    console.log('peer');
    console.log(peer);

    peer.on('signal', data => {
      console.log('signalling')
      console.log(data);
      this.props.sendDataToReceiver(data);
    })

    peer.on('connect', () => {
      console.log('connected')
      if (this.props.isInitiator){
        this.startVoiceStream();
      }
    });
    
    peer.on('stream', stream => {
       console.log('received stream starting')
       let audioNode = document.getElementById('voiceChat');
       console.log(audioNode);
       audioNode.srcObject = stream;
    })

    this.startVoiceStream = this.startVoiceStream.bind(this);
  }

  startVoiceStream = async () => {
    let audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    this.state.peer.addStream(audioStream);
  }

  componentDidMount(){
     console.log('')
  }

  componentDidUpdate(){
    if(this.props.peerConnectInfo){
      console.log('received connect info');
      this.state.peer.signal(this.props.peerConnectInfo)
      this.props.removeConnectInfo();
    }
  }



  render() {
    return(
        <div id="voice">
            <h1>Talking to {this.props.callParticipant}</h1>
        </div>
    )
  }
}

export default Voice;