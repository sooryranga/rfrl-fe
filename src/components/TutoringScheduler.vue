<template>
  <div id="TutoringScheduler">
    <transition name="fade">
      <div v-if="showError" class="alert alert-danger fade-in" role="alert">
        {{error}}
      </div>
    </transition>
    <div class="row">
      <div class="col">
        <h6 class="my-2">Schedule Tutoring</h6>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col my-auto">
        <div class="row" v-if="pendingSession === null">
          <div class="col h-100">
            <button
            v-on:click="create(true)"
            v-if="currentProfile.isTutor"
            class="btn btn-outline-dark mx-2 float-left">
              Tutor
            </button>
            <button
            v-on:click="create(false)"
            v-if="otherUserIsTutor"
            class="btn btn-outline-dark float-left">
              Learn from
            </button>
          </div>
        </div>
        <div class="row h-100" v-else-if="pendingSession.by === currentProfile.id">
          <div class="col my-auto">
            <div>
              <p class="m-0"> Waiting for response</p>
            </div>
          </div>
          <div class="h-100">
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
import {SessionService} from '@/api/SessionService';

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
    roomId: async function(roomId) {
      await this.setNewRoom();
    },
  },

  methods: {
    ...mapGetters('chatRooms', ['rooms', 'getUser']),
    async setNewRoom() {
      const currentRoom = this.rooms()[this.roomId];
      // user = this.getUsers(currentRoom.users)

      const users = {};
      for (let i = 0; i < currentRoom.users.length; i++) {
        const userId = currentRoom.users[i];
        users[userId] = this.getUser()(userId);
      }
      this.users = users;

      try {
        this.pendingSession = await SessionService.getPrendingSession(
            this.roomId,
        );
      } catch (error) {
        this.pendingSession = {
          id: '542db2df-60d8-4313-895a-96098d043512',
          users: this.users,
          tutorId: this.currentProfile.id,
          by: this.currentProfile.id,
        };
      }
    },
    create: async function(tutor) {
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
      const pendingSession = {
        users: {...this.users},
        tutorId,
        by,
      };
      try {
        this.pendingSession = await SessionService.create(
            this.roomId,
            pendingSession,
        );
      } catch (error) {
        console.error(error);
        this.pendingSession = {
          ...pendingSession,
          id: 'e2777493-62c5-469f-bd9b-0b36abbb3e52',
        };
      }
      console.log(this.pendingSession);
      this.$router.push({
        name: 'session-calendar',
        params: {
          localSession: this.pendingSession,
          sessionId: this.pendingSession.id,
          saveEvent: this.saveEventCallBack,
          deleteEvent: this.deleteEventCallBack,
        },
      });
    },
    modify: function() {
      this.$router.push({
        name: 'session-calendar',
        params: {
          localSession: this.pendingSession,
          sessionId: this.pendingSession.id,
          saveEvent: this.saveEventCallBack,
          deleteEvent: this.deleteEventCallBack,
        },
      });
    },
    deleteSession: async function() {
      try {
        await SessionService.delete(this.pendingSession.id);
      } catch (error) {
        this.pendingSession = null;
      }
    },
    saveEventCallBack: async function(session) {
      if (!session.id) {
        await SessionService.create(this.roomId, session);
      } else {
        await SessionService.save(session.id, session);
      }
    },
    deleteEventCallBack: async function(session) {
      if (!session.id) return;
      await SessionService.delete(session.id);
    },
  },

  mounted: async function() {
    if (!this.roomId) return;
    await this.setNewRoom();
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
