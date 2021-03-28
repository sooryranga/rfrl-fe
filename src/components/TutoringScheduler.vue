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
            v-on:click="create(this.currentProfile.id)"
            class="btn btn-outline-dark mx-2 float-left">
              Tutor
            </button>
            <button
            v-bind:class="{ tutorDropDownActive: 'dropdown-toggle' }"
            v-on:click="selectTutor(false)"
            class="btn btn-outline-dark float-left">
              Learn from
            </button>

            <div v-if="showDropDown" class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a v-for="(user, id) in selectableTutor" v-bind:key="id" class="dropdown-item">
                <div class="row">
                  <div class="col-2 my-2 mx-2">
                    <img class="profilePicture" v-bind:src="user.photo"/>
                  </div>
                  <div class="col">
                    {user.firstName}
                  </div>
                </div>
              </a>
            </div>
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
            {{pendingSession.tutor.firstName}} wants to tutor you
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
    wantsToLearnFromYou() {
      return 'Students wants to learn from you';
    },
    tutorDropDownActive() {
      return Object.keys(this.users).length > 2;
    },
    selectableTutor() {
      const filteredTutors = {...this.users};
      delete filteredTutors[this.currentProfile.id];
      return filteredTutors;
    },
    ...mapGetters('profile', ['currentProfile']),
  },

  data: function() {
    return {
      pendingSession: null,
      users: {},
      showError: false,
      tutorID: null,
      showDropDown: false,
    };
  },

  watch: {
    roomId: async function(roomId) {
      await this.setNewRoom();
    },
  },

  methods: {
    ...mapGetters('chatRooms', ['rooms', 'getUser']),
    async selectTutor() {
      if (Object.keys(this.users).length === 2) {
        const otherUserId = Object.keys(this.users).filter(
            (userID) => userID != this.currentProfile.id,
        )[0];
        return await create(otherUserId);
      }

      this.showDropDown = true;
    },
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
    async create(tutorID) {
      if (this.showDropDown) {
        this.showDropDown = false;
      }

      const by = this.currentProfile.id;

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
.profilePicture{
  background-size: cover;
  background-position: top center;
  border-radius:50%;
  background-color: #fff;
  height: 5vh;
  width: 5vh;
}
</style>
