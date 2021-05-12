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
import {WS_URL} from '@/conf';
import {v4 as uuidv4} from 'uuid';
import Peer from 'simple-peer';

const webrtcConn = () => {
  return {
    remotePeerId: null,
    closed: null,
    connected: null,
    peer: null,
    init({
      initiator,
      peerId,
      remotePeerId,
      publishSignalingMessage,
      announceSignalingInfo,
      onPeerStream,
      deleteWebRTCConn,
    }) {
      this.remotePeerId = remotePeerId;
      this.closed = false;
      this.connected = false;
      this.synced = false;
      /**
       * @type {any}
       */
      this.peer = new Peer({initiator});
      this.peer.on('signal', (signal) => {
        publishSignalingMessage(
            {to: remotePeerId, from: peerId, type: 'signal', signal},
        );
      });
      this.peer.on('connect', () => {
        console.log('connected to ', remotePeerId);
        this.connected = true;
      });
      this.peer.on('close', () => {
        this.connected = false;
        this.closed = true;
        deleteWebRTCConn(this.remotePeerId);
        this.peer.destroy();
        console.log('closed connection to ', remotePeerId);
        announceSignalingInfo();
      });
      this.peer.on('error', (err) => {
        console.log(
            'Error in connection to ', remotePeerId, ': ', err,
        );
        announceSignalingInfo();
      });

      this.peer.on('stream', onPeerStream);
    },
    destroy() {
      this.peer.destroy();
    },
  };
};


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
      peerId: uuidv4(),
    };
  },
  props: {
    conferenceId: String,
  },
  watch: {
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

    announceSignalingInfo() {
      if (this.conn.connected) {
        this.conn.send(
            JSON.stringify({type: 'subscribe', topics: [this.conferenceId]}),
        );
        publishSignalingMessage({type: 'announce', from: this.peerId});
      }
    },

    publishSignalingMessage(data) {
      this.conn.send(
          JSON.stringify({type: 'publish', topic: this.conferenceId, data}),
      );
    },

    deleteWebRTCConn(peerId) {
      if (peerId in this.webrtcConns) {
        delete this.webrtcConns[peerId];
      }
    },

    createWebRTCclient({initiator, remotePeerId}) {
      const rtc = webrtcConn();
      rtc.init({
        initiator,
        remotePeerId,
        peerId: this.peerId,
        publishSignalingMessage: this.publishSignalingMessage,
        announceSignalingInfo: this.announceSignalingInfo,
        onPeerStream: this.onPeerStream,
        deleteWebRTCConn: this.deleteWebRTCConn,
      });
      return rtc;
    },

    onDisconnect() {
      console.log(`disconnect (${this.url})`);
    },

    onConnect() {
      this.conn.send(
          JSON.stringify({type: 'subscribe', topics: [this.conferenceId]}),
      );
      this.publishSignalingMessage({type: 'announce', from: this.peerId});
    },

    onPeerStream(stream) {
      this.setMediaTrack(stream);
    },

    onMessage(m) {
      const message = JSON.parse(m.data);
      switch (message.type) {
        case 'publish': {
          const data = message.data;
          const peerId = this.peerId;
          if (
            data == null ||
            data.from === peerId ||
            (data.to !== undefined && data.to !== peerId)
          ) {
            // ignore messages that are not addressed to this conn
            return;
          }
          switch (data.type) {
            case 'announce':
              if (Object.keys(this.webrtcConns).length < this.maxConns) {
                if (!(data.from in this.webrtcConns)) {
                  this.webrtcConns[data.from] = this.createWebRTCclient({
                    initiator: true,
                    remotePeerId: data.from,
                  });
                }
              }
              break;
            case 'signal':
              if (data.to === peerId) {
                if (!(data.from in this.webrtcConns)) {
                  this.webrtcConns[data.from] = this.createWebRTCclient({
                    initiator: true,
                    remotePeerId: data.from,
                  });
                }
                this.webrtcConns[data.from].peer.signal(data.signal);
              }
              break;
          }
        }
      }
    },

    onError(error) {
      console.log(error);
    },

    async connectPeers() {
    // Create the local connection and its event listeners
      this.url = `${WS_URL}/${this.conferenceId}/simple-peer/`;
      this.conn = new WebSocket(this.url);
      this.conn.onmessage = this.onMessage;
      this.conn.onopen = this.onConnect;
      this.conn.onclose = this.onDisconnect;
      this.conn.onerror = this.onError;
    },
    setMediaTrack(stream) {
      if (
        this.videortc.srcObject !== stream
      ) {
        this.videortc.srcObject = stream;
        this.videortc.muted = true;
        this.videortc.play();
      }
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
      Object.values(this.webrtcConns).forEach((webrtc) =>{
        if (this.audioTrack) {
          webrtc.peer.addTrack(this.audioTrack, this.stream);
        }
        if (this.videoTrack) {
          webrtc.peer.addTrack(this.videoTrack, this.stream);
        }
      });
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
