<template>
  <div id="TutoringScheduler">
    <transition name="fade">
      <div v-if="showError" class="alert alert-danger fade-in" role="alert">
        {{error}}
      </div>
    </transition>
    <div class="row justify-content-between">
      <div class="col my-auto">
        <div v-if="pendingSession === null">
          <div class="float-left">
            <p class="float-left my-2"> Schedule Tutoring </p>
          </div>
          <div class="float-right">
            <button v-on:click="create(true)" v-if="currentProfile.isTutor" class="btn btn-outline-dark mr-2">
              Tutor
            </button>
            <button v-on:click="create(false)" v-if="otherUserIsTutor" class="btn btn-outline-dark">
              Learn from
            </button>
          </div>
        </div>
        <div v-else-if="pendingSession.by === currentProfile.id">
          <div class="float-left">
            <p class="float-left my-2"> Waiting for response </p>
          </div>
          <div class="float-right">
            <span v-on:click="modify" class="material-icons btn btn-outline-dark mr-2">
              create
            </span>
            <span v-on:click="deleteSession" class="material-icons btn btn-outline-dark">
              delete
            </span>
          </div>
        </div>
        <div v-else-if="this.pendingSession.by !== this.currentProfile.id">
          <p
          class="align-middle"
          v-if="this.pendingSession.tutorId != this.currentProfile.id">
            {{pendingSession.tutor.name}} wants to tutor you
          </p>
          <p
          class="align-middle"
          v-else>
            {{wantsToLearnFromYou}}
          </p>
          <span v-on:click="modify" class="material-icons">
            check
          </span>
          <span v-on:click="deleteSession" class="material-icons">
            delete
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'scheduled-tutoring',
  props: {
    'roomId': {
      type: String,
      required: true,
    },
  },
  computed: {
    wantsToLearnFromYou: function() {
      return 'Students wants to learn from you';
    },
    otherUserIsTutor: function() {
      if (Object.keys(this.users) != 2) return false;
      const keys = Object.keys(this.users);
      for (const i = 0; i < keys.length; i++) {
        const id = keys[i];
        if (id === this.currentProfile.id) continue;
        return this.users[id].isTutor || false;
      }
      return false;
    },
    ...mapGetters('profile', ['currentProfile']),
  },
  data: function() {
    return {
      pendingSession: null,
      users: {},
      showError: false,
    };
  },
  watch: {
    roomId: function(roomId) {
      const currentRoom = this.rooms()[this.roomId];
      // user = this.getUsers(currentRoom.users)
      // this.pendingSession = this.getSessionForUser(currentRoom.users)

      const users = {};
      for (let i = 0; i < currentRoom.users.length; i++) {
        const userId = currentRoom.users[i];
        users[userId] = this.getUser()(userId);
      }

      this.users = users;
    },
  },
  methods: {
    ...mapGetters('chatRooms', ['rooms', 'getUser']),
    create: function(tutor) {
      // this.createPendingSession(this.userId)
      if (this.users.length > 2 && !tutor) {
        this.error = 'Only tutor can schedule a session in a group!';
        this.showError = true;
        setTimeout(function() {
          this.error = null;
          this.showError = false;
        }.bind(this), 2000);
      }

      const by = this.currentProfile.id;
      let tutorId = this.userId;
      if (tutor) {
        tutorId = this.currentProfile.id;
      }
      this.pendingSession = {
        id: '1917bcf4-ef39-45e6-8a62-2ac12143ec36',
        users: this.users,
        tutorId,
        by,
      };

      this.$router.push({
        name: 'session-calendar',
        params: {sessionId: this.pendingSession.id},
      });
    },
    modify: function() {

    },
    deleteSession: function() {
      // this.deletePendingSession(this.pendingSession.id)
      this.pendingSession = null;
    },
  },
  mounted: function() {
  },
};
</script>

<style>
.btn-circle {
  width: 30px;
  height: 30px;
  text-align: center;
  padding: 6px 0;
  font-size: 12px;
  line-height: 1.428571429;
  border-radius: 15px;
}
.btn-circle.btn-lg {
  width: 50px;
  height: 50px;
  padding: 10px 16px;
  font-size: 18px;
  line-height: 1.33;
  border-radius: 25px;
}
.btn-circle.btn-xl {
  width: 70px;
  height: 70px;
  padding: 10px 16px;
  font-size: 24px;
  line-height: 1.33;
  border-radius: 35px;
}
</style>
