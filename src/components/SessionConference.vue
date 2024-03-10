<template>
  <div class="container-fluid h-100">
    <div v-if="!this.session" class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <div v-else class="row h-100">
      <div class='col-auto p-0 h-100'>
        <div class="h-100" style="width: 350px">
          <video-messaging
            style="height: 30%;"
            v-bind:conferenceId="conferenceId"
            v-bind:videoStream="videoStream"
            v-on:setTrack="setTrackOnPeers"
            v-on:removeTrack="removeTrackFromPeers"
            ref="videoMessaging"/>
          <div class="w-100" style="height:70%">
            <chat
              ref="chat"
              :isSingleRoom="true"
              :roomId="session.roomId"
              v-if="loggedIn"
              :currentUserId="currentProfileId">
            </chat>
          </div>
        </div>
      </div>
      <div class="col p-0 h-100">
        <div id="session-tools">
          <div id="session-tools-nav">
            <nav class="navbar navbar-expand-lg navbar-light bg-light h-100">
              <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                  <li class="nav-item active">
                    <router-link
                      class="nav-link"
                      :to="{ name: 'code', params: {userId: $route.params.userId, conferenceId}}">
                      Code
                    </router-link>
                  </li>
                  <li class="nav-item">
                    <router-link
                      class="nav-link"
                      :to="{ name: 'text-editor', params: {userId: $route.params.userId, conferenceId}}">
                      Text Editor
                    </router-link>
                  </li>
                  <li class="nav-item">
                    <router-link
                      class="nav-link"
                      :to="{ name: 'screen-share', params: {conferenceId}}">
                      Screen Share
                    </router-link>
                  </li>
                </ul>
                <ul class="navbar-nav ms-auto">
                  <li class="nav-item">
                    <button v-on:click="report" class="btn btn-sm btn-light" type="button" aria-label="report">
                      <span class="material-icons-outlined" style="vertical-align: middle;">
                        report
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          <div id="session-tool-view">
            <router-view
              :doc="doc"
              :videoStream="shareScreenStream"
              :provider="provider"
              v-on:setTrack="setTrackOnPeers"
              v-on:removeTrack="removeTrackFromPeers"
              :key="$route.path"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {v4 as uuidv4} from 'uuid';
import VideoMessaging from '@/components/VideoMessaging.vue';
import {WS_URL} from '@/conf';
import * as Y from 'yjs';
import {WebrtcProvider} from 'y-webrtc';
import {WebrtcManager, WEBCAM_STREAM_TYPE, SCREEN_STREAM_TYPE} from '@/webrtc';
import Chat from '@/components/Chat';
import {mapGetters} from 'vuex';
import {Session} from '@/api';

export default {
  name: 'session-conference',
  components: {
    'chat': Chat,
    'video-messaging': VideoMessaging,
  },
  data: function() {
    return {
      session: null,
      doc: null,
      provider: null,

      peerId: uuidv4(),
      webrtcManger: null,
      videoStream: null,
      shareScreenStream: null,

      idToStream: {},
      idToType: {},
    };
  },

  props: {
    sessionId: {
      value: [Number, String],
      required: true,
    },
    conferenceId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters('profile', ['currentProfileId', 'loggedIn']),
  },
  methods: {
    async report() {
      this.$refs.chat.reportClient(this.session.roomId);
    },
    setTrackOnPeers({stream, track, type}) {
      this.sendDataToPeers({
        type,
        streamId: stream.id,
      });

      this.webrtcManger.addTrack({track, stream});
    },
    removeTrackFromPeers({track, stream}) {
      this.webrtcManger.removeTrack({track, stream});
    },
    matchAndSetStream({type, stream}) {
      if (type === WEBCAM_STREAM_TYPE) {
        this.videoStream = stream;
        return;
      }

      if (type === SCREEN_STREAM_TYPE) {
        this.shareScreenStream = stream;
        return;
      }

      console.error('Did not match to any stream type');
    },
    announceMediaStream(stream) {
      this.idToStream[stream.id] = stream;
      if (!(stream.id in this.idToType)) return;

      this.matchAndSetStream({
        type: this.idToType[stream.id],
        stream,
      });
    },
    announceData(data) {
      const {type, streamId} = data;
      this.idToType[streamId] = type;

      if (!(streamId in this.idToStream)) return;

      this.matchAndSetStream({
        type,
        stream: this.idToStream[streamId],
      });
    },
    sendDataToPeers(data) {
      this.webrtcManger.sendData(data);
    },
  },
  async mounted() {
    try {
      this.session = await Session.SessionService.get(parseInt(this.sessionId));
    } catch (error) {
      throw error;
    }
    const url = `${WS_URL}/${this.conferenceId}/simple-peer/`;
    this.webrtcManger = new WebrtcManager({
      peerId: this.peerId,
      conferenceId: this.conferenceId,
      url,
      setMediaTrack: (stream) => this.announceMediaStream(stream),
      announceData: (data) => this.announceData(data),
    });

    this.doc = new Y.Doc();
    this.provider = new WebrtcProvider(
        this.conferenceId,
        this.doc,
        {
          signaling: [`${WS_URL}/${this.conferenceId}/yjs/`],
        },
    );
  },
  beforeDestroy() {
    this.provider.disconnect();
    this.provider.destroy();
  },
};
</script>

<style scoped>
#left-bar{
  position:relative;
  width:21vw;
  min-width: 300px;
  flex: 0 1 auto!important;;
}

#session-tools{
  display: flex;
  flex-direction: column;
  height:100%;
}

#session-tools-nav{
  flex: 0 0 auto;
  width: 100%;
}
#session-tool-view{
  flex: 1 1 100%;
  width: 100%;
  min-height: 0;
}
</style>
