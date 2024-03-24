<template>
    <div ref="parent" id="parent">
      <div>
        <video id="rtcvideo" ref="videortc" class="video" muted="muted" playsinline>
          RTC Video stream not available.
        </video>
      </div>
      <div>
        <video id="myvideo" ref="video" class="video" muted="muted" playsinline>
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
import {WEBCAM_STREAM_TYPE} from '@/webrtc';

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
      stream: null,
    };
  },
  props: {
    conferenceId: String,
    videoStream: MediaStream,
  },
  watch: {
    videoStream(stream, _) {
      this.videortc.srcObject = stream;
      this.videortc.play();

      stream.onremovetrack = (event) => {
        event.track.stop();
        this.videortc.load();
      };
    },
    async allowVideo(val, _) {
      if (this.videoTrack != null && val === false) {
        this.$emit(
            'removeTrack',
            {track: this.videoTrack, stream: this.stream},
        );
        this.videoTrack.stop();
        this.videoTrack = null;
        return;
      }
      await this.startStream(val, this.allowAudio);
      this.setTracks();
    },
    async allowAudio(val, _) {
      if (this.audioTrack != null) {
        this.audioTrack.enabled = val;
        return;
      }
      await this.startStream(this.allowVideo, val);
      this.setTracks();
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
    async startStream(video, audio) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(
            {
              video: {
                width: {ideal: 640},
                height: {ideal: 480},
                aspectRatio: 1.777777778,
                frameRate: {ideal: 10},
              },
              audio,
            },
        );
        console.log(stream);
        if (this.videoTrack) {
          this.videoTrack.stop();
          this.videoTrack = null;
        }
        if (this.audioTrack) {
          this.audioTrack.stop();
          this.audioTrack = null;
        }
        if (video) {
          this.videoTrack = stream.getVideoTracks()[0];
        }
        if (audio) {
          this.audioTrack = stream.getAudioTracks()[0];
        }
        this.video.srcObject = stream;
        this.video.play();
        this.stream = stream;
      } catch (err) {
        console.log('An error occurred: ' + err);
        self.allowScreenShare = false;
        self.allowAudio = false;
      }
    },
    setTracks() {
      if (this.videoTrack) {
        this.$emit(
            'setTrack',
            {
              track: this.videoTrack,
              stream: this.stream,
              type: WEBCAM_STREAM_TYPE,
            },
        );
      }
      if (this.audioTrack) {
        this.$emit(
            'setTrack',
            {
              track: this.audioTrack,
              stream: this.stream,
              type: WEBCAM_STREAM_TYPE,
            },
        );
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
