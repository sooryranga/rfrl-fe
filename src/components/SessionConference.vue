<template>
  <div class="container-fluid h-100">
    <div class="row h-100">
      <div class='col-auto p-0 h-100'>
        <div class="h-100" style="width: 350px">
          <video-messaging style="height: 30%;"></video-messaging>
          <chat
            :isSingleRoom="true"
            :roomId="session.roomId"
            :currentUserId="currentProfile.id"
            style="height: 70%; max-height: 65vh;">
          </chat>
        </div>
      </div>
      <div class="col">
        <div class="row" style="height:6%">
          <div class="col p-0">
            <nav id="tutor-nav" class="navbar navbar-expand-lg navbar-light bg-light">
              <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                  <li class="nav-item active">
                    <router-link
                      class="nav-link"
                      :to="{ name: 'code', params: {userId: $route.params.userId, conferenceId }}">
                      Code
                    </router-link>
                  </li>
                  <li class="nav-item">
                    <router-link
                      class="nav-link"
                      :to="{ name: 'text-editor', params: {userId: $route.params.userId, conferenceId }}">
                      Text Editor
                    </router-link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
        <div class="row" style="height:94%">
          <div class="col p-0">
            <router-view :key="$route.path"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chat from '@/components/Chat';
import {mapGetters} from 'vuex';
import {Session} from '@/api';

export default {
  name: 'session-conference',
  components: {
    'chat': Chat,
  },
  data: function() {
    return {
      session: null,
    };
  },
  props: {
    sessionId: {
      type: Number,
      required: true,
    },
    conferenceId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
  },
  async mounted() {
    try {
      this.session = await Session.SessionService.get(this.sessionId);
    } catch (error) {
      throw error;
    }
  },
};
</script>

<style>
#tutor-nav{
  flex: 0 0 auto!important;
}
#left-bar{
  position:relative;
  width:21vw;
  min-width: 300px;
  flex: 0 1 auto!important;;
}
</style>
