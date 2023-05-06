<template>
    <div ref="parent" id="parent">
      <div>
        <video id="rtcvideo" ref="videortc" class="video">
          RTC Video stream not available.
        </video>
      </div>
      <div>
        <video id="myvideo" ref="video" class="video">
          Video stream not available.
        </video>
      </div>
      <div id="buttonrow" class="row">
        <div class="col">
          <i class="material-icons md-36 md-light" v-on:click="allowVideo=!allowVideo" v-if="!allowVideo">videocam</i>
          <i class="material-icons md-36 md-light" v-on:click="allowVideo=!allowVideo" v-else>videocam_off</i>
        </div>
        <div class="col">
          <i class="material-icons md-36 md-light" v-on:click="allowAudio=!allowAudio" v-if="!allowAudio">volume_up</i>
          <i class="material-icons md-36 md-light" v-on:click="allowAudio=!allowAudio" v-else>volume_mute</i>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'video-conference',
  data: function() {
    return {
      allowVideo: false,
      allowAudio: false,
      video: null,
      video2: null,
      audioTrack: null,
      videoTrack: null,
      audioTrackSender: null,
      videoTrackSender: null,
      stream: null,
      height: 0,
      width: 320,

      connectButton: null,
      disconnectButton: null,
      sendButton: null,
      messageInputBox: null,
      receiveBox: null,
      localConnection: null,
      remoteConnection: null,
      sendChannel: null,
      receiveChannel: null,
    };
  },
  watch: {
    allowVideo: function(val, _) {
      if (this.videoTrack != null && val == false) {
        if (this.localConnection && this.videoTrackSender) {
          this.localConnection.removeTrack(this.videoTrackSender);
          this.videoTrackSender = null;
        }
        this.videoTrack.stop();
        this.videoTrack = null;
      } else {
        this.startStream(val, this.allowAudio)
            .then(() => this.setTracks());
      }
    },
    allowAudio: function(val, _) {
      if (this.audioTrack != null) {
        this.audioTrack.enabled = val;
      } else {
        this.startStream(this.allowVideo, val)
            .then(() => this.setTracks());
      }
    },
  },
  mounted: function() {
    this.video = this.$refs.video;
    this.video2 = this.$refs.videortc;

    this.connectPeers();
  },
  methods: {
    connectPeers: function() {
    // Create the local connection and its event listeners

      this.localConnection = new RTCPeerConnection();

      // Create the data channel and establish its event listeners
      this.sendChannel = this.localConnection.createDataChannel('sendChannel');
      this.sendChannel.onopen = this.handleSendChannelStatusChange;
      this.sendChannel.onclose = this.handleSendChannelStatusChange;

      // Create the remote connection and its event listeners

      this.remoteConnection = new RTCPeerConnection();
      this.remoteConnection.ondatachannel = this.receiveChannelCallback;

      // Set up the ICE candidates for the two peers

      this.localConnection.onicecandidate = (e) => !e.candidate ||
        this.remoteConnection.addIceCandidate(e.candidate)
            .catch(this.handleAddCandidateError);

      this.remoteConnection.onicecandidate = (e) => !e.candidate ||
        this.localConnection.addIceCandidate(e.candidate)
            .catch(this.handleAddCandidateError);

      this.localConnection.onnegotiationneeded = (ev) => {
        this.localConnection.createOffer()
            .then((offer) => this.localConnection.setLocalDescription(offer))
            .then(() => this.sendOfferMessage({
              type: 'video-offer',
              sdp: this.localConnection.localDescription,
            }))
            .catch((err) => {
              console.error(err);
            });
      };

      this.remoteConnection.ontrack = this.setMediaTrack;
    },
    handleCreateDescriptionError: function(error) {
      console.log('Unable to create an offer: ' + error.toString());
    },
    handleLocalAddCandidateSuccess: function() {
      this.connectButton.disabled = true;
    },
    handleRemoteAddCandidateSuccess: function() {
      this.disconnectButton.disabled = false;
    },
    handleAddCandidateError: function() {
      console.log('Oh noes! addICECandidate failed!');
    },
    handleSendChannelStatusChange: function(event) {
      if (this.sendChannel) {
        const state = this.sendChannel.readyState;
        console.log(state);
      }
    },
    setMediaTrack: function(e) {
      if (
        this.video2.srcObject !== e.streams[0]
      ) {
        this.video2.srcObject = e.streams[0];
        this.video2.play();
        console.log('pc1: received remote stream');
      }
    },
    sendOfferMessage: function(data) {
      this.remoteConnection
          .setRemoteDescription(data.sdp)
          .then(() => this.remoteConnection.createAnswer())
          .then((answer) => this.remoteConnection.setLocalDescription(answer))
          .then(()=> this.sendAnswerMessage({
            type: 'video-offer',
            sdp: this.remoteConnection.localDescription,
          }))
          .catch((err)=>console.error(err));
    },
    sendAnswerMessage: function(data) {
      this.localConnection
          .setRemoteDescription(data.sdp)
          .catch((err)=>console.error(err));
    },
    startStream: function(video, audio) {
      const self = this;
      return navigator.mediaDevices.getUserMedia(
          {video, audio},
      )
          .then(function(stream) {
            if (self.videoTrack) {
              self.videoTrack.stop();
              self.videoTrack = null;
            }
            if (self.audioTrack) {
              self.audioTrack.stop();
              self.audioTrack = null;
            }
            if (video) {
              self.videoTrack = stream.getVideoTracks()[0];
            }
            if (audio) {
              self.audioTrack = stream.getAudioTracks()[0];
            }
            self.video.srcObject = stream;
            self.video.play();
            self.stream = stream;
          })
          .catch(function(err) {
            console.log('An error occurred: ' + err);
            self.allowVideo = false;
            self.allowAudio = false;
          });
    },
    setTracks: function() {
      if (!this.localConnection) {
        return;
      }
      if (this.audioTrackSender) {
        this.localConnection.removeTrack(this.audioTrackSender);
        this.audioTrackSender = null;
      }
      if (this.videoTrackSender) {
        this.localConnection.removeTrack(this.videoTrackSender);
        this.videoTrackSender = null;
      }
      if (this.audioTrack) {
        this.localConnection.addTrack(this.audioTrack, this.stream);
        this.localConnection.getSenders().forEach((sender)=>{
          if (sender.track == this.audioTrack) {
            this.audioTrackSender = sender;
          }
        });
      }
      if (this.videoTrack) {
        this.localConnection.addTrack(this.videoTrack, this.stream);
        this.localConnection.getSenders().forEach((sender)=>{
          if (sender.track == this.videoTrack) {
            this.videoTrackSender = sender;
          }
        });
      }
    },
  },
};
</script>

<style scoped>
#parent{
  position: relative;
  width: 25vw;
  height: calc(25vw * (3/4));
  min-width: 300px;
  min-height: calc(300px*(3/4));
  background-color: black;
}
#rtcvideo{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
}
#myvideo{
  position: absolute;
  bottom: 2%;
  left: 2%;
  width: 30%;
  height: 30%;
  z-index: 1;
}
#buttonrow{
  position: absolute;
  bottom: 2%;
  right: 5%;
  z-index: 1;
}
.md-light { color: rgb(136, 136, 136); }
.material-icons.md-18 { font-size: 18px; }
.material-icons.md-24 { font-size: 24px; }
.material-icons.md-36 { font-size: 36px; }
.material-icons.md-48 { font-size: 48px; }
</style>
