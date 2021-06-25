<template>
  <div id="TutoringScheduler">
    <transition name="fade">
      <div v-if="showError" class="alert alert-danger fade-in" role="alert">
        {{error}}
      </div>
    </transition>
    <h5 id="component-name">Schedule</h5>
    <div v-if="pendingSessions.length" id="pending-sessions">
      <div v-for="(session) in pendingSessions" v-bind:key="session.id">
        <div class="h-100" v-if="isWaitingForResponseFromOthers(session)">
          <p class="m-0"> Waiting for response</p>
          <button @click="modify(session)" class="btn-no-style">
            <edit-icon  class="mr-2 scheduler-icon"/>
          </button>
          <button @click="deleteSession(session)" class="btn-no-style">
            <delete-icon class="mr-2 scheduler-icon"/>
          </button>
        </div>
        <div v-else>
          <div class="row h-100" v-if="isWaitingForResponseFromYou(session)">
            <div class="col my-auto">
              <p class="align-middle" v-if="session.tutorId != currentProfile.id">
                {{session.tutor.firstName}} wants to tutor you
              </p>
              <p class="align-middle" v-else>
                {{wantsToLearnFromYou}}
              </p>
            </div>
            <p>
              <button  v-on:click="modify(session)" class="btn-no-style">
                <check-icon class="mr-2 scheduler-icon"/>
              </button>
              <button v-on:click="deleteSession(session)" class="btn-no-style">
                <delete-icon class="mr-2 scheduler-icon"/>
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div id="create-session-container">
      <h6 id="component-subheader">Create New</h6>
      <p>
        <button
        v-if="currentProfile.isTutor"
        v-on:click="create(currentProfile.id)"
        class="primary-btn primary-btn-light mx-2 float-left scheduler-btn">
          Tutor
        </button>
      </p>
      <p>
        <button
        v-bind:class="{ tutorDropDownActive: 'dropdown-toggle' }"
        v-on:click="selectTutor"
        class="primary-btn primary-btn-light mx-2 float-left scheduler-btn">
          Learn from
        </button>
      </p>
      <div v-if="showDropDown" class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a v-for="(user, id) in selectableTutor" v-bind:key="id" class="dropdown-item">
          <div class="row">
            <div class="col-2 my-2 mx-2">
              <img class="profilePicture" v-bind:src="user.photo"/>
            </div>
            <div class="col">
              {user.username}
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {EditIcon, DeleteIcon, CheckIcon} from '@/components/icons/';
import {SessionService} from '@/api/SessionService';

export default {
  name: 'tutoring-scheduler',

  components: {
    EditIcon,
    DeleteIcon,
    CheckIcon,
  },

  props: {
    'roomId': {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapGetters('profile', ['currentProfile']),
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
    currentRoom() {
      if (!this.roomId) return {};

      return this.$store.getters['chatRooms/getRoom'](this.roomId);
    },
  },

  data: function() {
    return {
      pendingSessions: [],
      users: {},
      showError: false,
      showDropDown: false,
    };
  },

  watch: {
    currentRoom: async function() {
      if (!this.currentRoom) return;
      await this.setNewRoom();
    },
  },

  methods: {
    ...mapGetters('chatRooms', ['getUser']),
    async selectTutor() {
      if (Object.keys(this.users).length === 2) {
        const otherUserId = Object.keys(this.users).filter(
            (userID) => userID != this.currentProfile.id,
        )[0];
        return await this.create(otherUserId);
      }

      this.showDropDown = true;
    },
    isWaitingForResponseFromOthers(session) {
      return session.eventId != null && session.canAttend != null;
    },
    isWaitingForResponseFromYou(session) {
      return session.eventId != null && session.canAttend === null;
    },
    isWaitingToCreateEvent(session) {
      return session.eventId === null;
    },
    async setNewRoom() {
      const users = {};
      for (let i = 0; i < this.currentRoom.users.length; i++) {
        const userId = this.currentRoom.users[i];
        users[userId] = this.getUser()(userId);
      }
      this.users = users;

      try {
        this.pendingSessions = await SessionService.getPrendingSession(
            this.roomId,
        );
      } catch (error) {
        throw error;
      }
    },
    async create(tutorId) {
      if (this.showDropDown) {
        this.showDropDown = false;
      }

      const clientIds = Object.keys(this.users);

      const session = {
        roomId: this.roomId,
        clientIds,
        tutorId,
      };

      let createdSession;
      try {
        createdSession = await SessionService.create({session});
        this.pendingSessions.push(createdSession);
      } catch (error) {
        throw error;
      }

      this.$router.push({
        name: 'session-calendar',
        params: {
          sessionId: createdSession.id,
        },
      });
    },
    modify: function(session) {
      this.$router.push({
        name: 'session-calendar',
        params: {
          sessionId: session.id,
        },
      });
    },
    deleteSession: async function(session) {
      console.log('deleteSession');
      try {
        await SessionService.delete(session.id);
      } catch (error) {
        throw error;
      }
      this.pendingSessions = this.pendingSessions.filter(
          (s) => s.id != session.id,
      );
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
};
</script>

<style scoped>
#component-name{
  font-weight: 400;
  font-size: 1.5rem;
  padding-bottom: 1rem;
  margin-bottom: 0rem;
  color: white;
}

#component-subheader{
  font-weight: 400;
  font-size: 1.1rem;
  padding-bottom: 1rem;
  color:white;
}

#pending-sessions{
  padding-bottom: 1rem;
}

.scheduler-btn{
  width: 100%;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  max-width:18rem;
}

.scheduler-icon{
  font-size:2rem;
  height:100%;
}

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
.btn-no-style{
  background: none;
  color: inherit;
  border: none;
  cursor: pointer;
  outline: inherit;
  height:3rem;
  width:3rem;
}
</style>
