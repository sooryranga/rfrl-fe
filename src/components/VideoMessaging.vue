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
  name: 'video-messaging',
  data: function() {
    return {
      allowVideo: false,
      allowAudio: false,
      video: null,
      videortc: null,
      audioTrack: null,
      videoTrack: null,
      audioTrackSender: null,
      videoTrackSender: null,
      stream: null,

      peer: null,
      webrtcConns: {},
      maxConns: 20,
    };
  },
  props: {
    conferenceId: String,
    videoStream: MediaStream,
  },
  watch: {
    videoStream(val, _) {
      this.videortc.srcObject = val;
      this.videortc.muted = true;
      this.videortc.play();
    },
    allowVideo(val, _) {
      if (this.videoTrack != null && val === false) {
        if (this.peer) {
          this.peer.removeTrack(this.videoTrack, this.stream);
          this.videoTrackSender = null;
        }
        this.videoTrack.stop();
        this.videoTrack = null;
      } else {
        this.startStream(val, this.allowAudio)
            .then(() => this.setTracks());
      }
    },
    allowAudio(val, _) {
      if (this.audioTrack != null) {
        this.audioTrack.enabled = val;
      } else {
        this.startStream(this.allowVideo, val)
            .then(() => this.setTracks());
      }
    },
  },
  async mounted() {
    this.video = this.$refs.video;
    this.videortc = this.$refs.videortc;

    await this.connectPeers();
  },
  beforeDestroy() {
    if (this.audioTrack) {
      this.audioTrack.stop();
    }
    if (this.videoTrack) {
      this.videoTrack.stop();
    }
  },
  methods: {
    async connectPeers() {
    // Create the local connection and its event listeners
    },
    startStream(video, audio) {
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
    setTracks() {
      if (this.audioTrack) {
        this.$emit('setTrack', {track: this.audioTrack, stream: this.stream});
      }
      if (this.videoTrack) {
        this.$emit('setTrack', {track: this.videoTrack, stream: this.stream});
      }
    },
  },
};
</script>

<style scoped>
#parent{
  position: relative;
  flex: 0 0 auto!important;
  height: 30%;
  width: 100%;
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
