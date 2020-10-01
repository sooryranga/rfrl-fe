<template>
    <div ref="parent" class="container">
      <div class="row">
        <div class="col camera">
          <video ref="video">
            Video stream not available.
          </video>
          <video ref="videortc">
            RTC Video stream not available.
          </video>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <button v-on:click="allowVideo=!allowVideo" class="btn btn-dark">
            Video
          </button>
        </div>
        <div class="col">
          <button ref="takepicturebutton" class="btn btn-dark">
            Take Picture
          </button>
        </div>
        <div class="col">
          <button v-on:click="allowAudio=!allowAudio" class="btn btn-dark">
            Audio
          </button>
        </div>
      </div>
      <div class="row">
        <canvas ref="canvas" class="mx-auto">
          <div class="output">
            <img ref="photo" alt="The screen capture will appear in this box.">
          </div>
        </canvas>
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
      canvas: null,
      photo: null,
      startbutton: null,
      audioTrack: null,
      videoTrack: null,
      audioTrackSender: null,
      videioTrackSender: null,
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
        if (this.localConnection) {
          this.localConnection.removeTrack(this.videioTrackSender, this.stream);
          this.videioTrackSender = null;
        }
        this.videoTrack.stop();
        this.videoTrack = null;
      } else {
        this.startStream(val, this.allowAudio)
            .then(() => {
              if (this.localConnection) {
                this.localConnection.addTrack(this.videoTrack, this.stream);
                this.localConnection.getSenders().forEach((sender)=>{
                  if (sender.track == this.videoTrack) {
                    this.videioTrackSender = sender;
                  }
                });
              }
            });
      }
    },
    allowAudio: function(val, _) {
      if (this.audioTrack != null && val == false) {
        if (this.localConnection) {
          this.localConnection.removeTrack(this.audioTrackSender);
          this.audioTrackSender = null;
        }
        this.audioTrack.stop();
        this.audioTrack = null;
      } else {
        this.startStream(this.allowVideo, val)
            .then(() => {
              if (this.localConnection) {
                this.localConnection.addTrack(this.audioTrack);
                this.localConnection.getSenders().forEach((sender)=>{
                  if (sender.track == this.audioTrack) {
                    this.audioTrackSender = sender;
                  }
                });
              }
            });
      }
    },
  },
  mounted: function() {
    this.matchDemension();
    this.video = this.$refs.video;
    this.video2 = this.$refs.videortc;
    this.canvas = this.$refs.canvas;
    this.photo = this.$refs.photo;
    this.startbutton = this.$refs.takepicturebutton;
    const self = this;

    this.video.oncanplay = this.setCanPlay;
    this.video2.oncanplay = this.setCanPlay;

    this.startbutton.addEventListener('click', function(ev) {
      self.takepicture();
      ev.preventDefault();
    }, false);

    this.clearphoto();
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
      console.log(e);
      if (
        this.video2.srcObject !== e.streams[0]
      ) {
        console.log(e.streams);
        this.video2.srcObject = e.streams[0];
        this.video2.play();
        console.log(e.streams);
        console.log('pc1: received remote stream');
      }
    },
    matchDemension: function() {
      this.width = Math.floor(this.$refs.parent.clientWidth/2);
    },
    clearphoto: function() {
      const context = this.canvas.getContext('2d');
      context.fillStyle = '#AAA';
      context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      const data = this.canvas.toDataURL('image/png');
      this.photo.setAttribute('src', data);
    },
    takepicture: function() {
      const context = this.canvas.getContext('2d');
      if (this.width && this.height) {
        canvas.width = this.width;
        canvas.height = this.height;
        context.drawImage(this.video, 0, 0, this.width, this.height);

        const data = this.canvas.toDataURL('image/png');
        this.photo.setAttribute('src', data);
      } else {
        this.clearphoto();
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
      if (!video && !audio) {
        return;
      }
      const self = this;
      this.videoTrack = null;
      this.audioTrack = null;
      return navigator.mediaDevices.getUserMedia(
          {video, audio},
      )
          .then(function(stream) {
            self.stream = stream;
            if (video) {
              self.videoTrack = stream.getVideoTracks()[0];
            }
            if (audio) {
              self.audioTrack = stream.getAudioTracks()[0];
            }
            self.video.srcObject = stream;
            self.video.play();
          })
          .catch(function(err) {
            console.log('An error occurred: ' + err);
            self.allowVideo = false;
            self.allowAudio = false;
          });
    },
    setCanPlay: function(ev) {
      const video = ev.srcElement;
      if (!this.streaming) {
        this.height = (
          video.videoHeight /
          (video.videoWidth/this.width)
        );

        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.

        if (isNaN(this.height)) {
          this.height = this.width / (4/3);
        }

        video.setAttribute('width', this.width);
        video.setAttribute('height', this.height);
        this.canvas.setAttribute('width', this.width);
        this.canvas.setAttribute('height', this.height);
        this.streaming = true;
      }
    },
  },
};
</script>

<style scoped>
#video{
  background-color: black;
}

</style>
