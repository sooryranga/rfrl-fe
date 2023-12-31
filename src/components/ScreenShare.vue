<template>
    <div ref="parent" id="parent">
      <div>
        <video id="rtcvideo" ref="videortc" class="video">
          RTC Video stream not available.
        </video>
      </div>
      <div id="buttonrow" class="row" v-if="!othersSharing">
        <div class="col" >
          <i
            class="material-icons md-36 md-light"
            v-on:click="allowScreenShare=!allowScreenShare"
            v-if="!allowScreenShare">screen_share</i>
          <i
            class="material-icons md-36 md-light"
            v-on:click="allowScreenShare=!allowScreenShare" v-else>stop_screen_share</i>
        </div>
      </div>
    </div>
</template>

<script>
import {SCREEN_STREAM_TYPE} from '@/webrtc';

export default {
  name: 'screen-share',
  data: function() {
    return {
      allowScreenShare: false,
      videortc: null,
      videoTrack: null,
      stream: null,
      othersSharing: false,
    };
  },
  props: {
    conferenceId: String,
    videoStream: MediaStream,
  },
  watch: {
    videoStream(val, _) {
      this.othersSharing = true;
      const tracks = val.getVideoTracks();
      const webrtcTrack = tracks.length > 0? tracks[0]: null;

      if (webrtcTrack) {
        webrtcTrack.onmute = () => {
          webrtcTrack.stop();
          this.othersSharing = false;
        };
      }

      this.videortc.srcObject = val;
      this.videortc.muted = true;
      this.videortc.play();
    },
    async allowScreenShare(val, _) {
      if (val === false) {
        if (this.videoTrack) {
          this.$emit(
              'removeTrack',
              {track: this.videoTrack, stream: this.stream},
          );
          this.videoTrack.stop();
        }
        if (this.audioTrack) {
          this.$emit(
              'removeTrack',
              {track: this.videoTrack, stream: this.stream},
          );
          this.audioTrack.stop();
        }

        this.videoTrack = null;
        this.audioTrack = null;
        return;
      }

      await this.startStream();
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
    async startStream() {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia(
            {video: true, audio: true},
        );
        if (this.videoTrack) {
          this.videoTrack.stop();
          this.videoTrack = null;
        }
        if (this.audioTrack) {
          this.audioTrack.stop();
          this.audioTrack = null;
        }
        this.videoTrack = stream.getVideoTracks()[0];
        this.audioTrack = stream.getAudioTracks()[0];
        this.stream = stream;
        this.videortc.srcObject = stream;
        this.videortc.play();
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
              type: SCREEN_STREAM_TYPE,
            },
        );
      }
      if (this.audioTrack) {
        this.$emit(
            'setTrack',
            {
              track: this.audioTrack,
              stream: this.stream,
              type: SCREEN_STREAM_TYPE,
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
  height: 100%;
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
