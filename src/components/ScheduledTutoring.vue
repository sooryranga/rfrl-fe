
<template>
  <div id="scheduledTutoring">
    <div class="row">
      <div class="col">
        <h5 class="my-2 component-name">Scheduled Tutoring</h5>
      </div>
    </div>
    <div v-if="scheduledSessions.length">
      <div class="row mt-1 h-100" v-for="(dateSession,index) in dateScheduledSessions" v-bind:key="index">
        <div class="col-1 p-0 my-1">
          <button
            class="circle-btn mx-auto"
            v-bind:class="[isToday(dateSession.date) ?'date-dark': 'date-light']">
            {{dateSession.date.getDate()}}
          </button>
        </div>
        <div class="col-3 my-1">
          <div class="text-center">{{dateSession.date.getMonth()}} {{toDay(dateSession.date.getDay())}}</div>
        </div>
        <div class="col align-middle" id="sessions">
          <div
            class="row mb-1"
            v-for="session in dateSession.sessions"
            v-bind:key="session.id">
            <button
            class="btn btn-outline-dark w-100"
            v-on:click="goToEvent(session)">
              <div v-if="showName" class="row">
                <div class="col-6 my-auto">
                  <div><p
                    class="m-0"
                    style="color:var(--clr-gray-1)">
                    {{session.event.start.toLocaleTimeString()}}
                  </p></div>
                </div>
                <div class="col-auto my-auto">
                  <p class="m-0" style="color:var(--clr-gray-1)">
                    With {{
                      currentProfileId === session.tutorId ?
                      getName(getMentee(session)) :
                      getName(session.tutor)
                    }}
                  </p>
                </div>
              </div>
              <div v-else class="row">
                <div class="col my-auto">
                  <div class="m-0">{{session.event.start.toLocaleTimeString()}}</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="mt-4">
        <p> You haven't scheduled tutoring yet. Give it a try! </p>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {dayOfWeekMapping} from '@/utils.js';
import {Session} from '@/api';

export default {
  name: 'scheduled-tutoring',
  props: {
    'profileId': {
      type: String,
      required: false,
    },
    'roomId': {
      type: String,
      required: false,
    },
    'showName': {
      type: Boolean,
    },
  },
  data() {
    return {
      scheduledSessions: [],
    };
  },
  computed: {
    ...mapGetters('profile', ['currentProfileId']),
    dateScheduledSessions() {
      if (this.scheduledSessions.length === 0) {
        return [];
      }

      let _date = this.scheduledSessions[0].event.start;
      _date.setHours(0, 0, 0, 0);
      const cache = [{date: _date, sessions: []}];

      for (let i = 0; i < this.scheduledSessions.length; i++) {
        const session = this.scheduledSessions[i];
        const _compDate = session.event.start;
        _compDate.setHours(0, 0, 0, 0);

        if (_compDate > _date) {
          _date = _compDate;
          cache.push({date: _date, sessions: []});
        }
        cache[cache.length-1].sessions.push(session);
      }
      return cache;
    },
  },
  watch: {
    async roomId() {
      await this.importSessionForRoom();
    },
    async profileId() {
      await this.importSessionForUser();
    },
  },
  methods: {
    goToEvent(session) {
      this.$router.push({
        name: 'session-info',
        params: {sessionId: session.id},
      });
    },
    isToday(checkingDate) {
      const today = new Date();
      return (
        today.getFullYear() === checkingDate.getFullYear() &&
        today.getMonth() === checkingDate.getMonth() &&
        today.getDate() === checkingDate.getDate()
      );
    },
    toDay(day) {
      return dayOfWeekMapping[day];
    },
    async importSessionForUser() {
      this.scheduledSessions = await Session.
          SessionService.getSessionForProfile();
    },
    async importSessionForRoom() {
      this.scheduledSessions = await Session.
          SessionService.getScheduledSessions(
              this.roomId,
          );
    },
    getMentee(session) {
      const mentees = session.clients.filter((client) => {
        client.id != session.tutorId;
      });

      return mentees[0];
    },
    getName(profile) {
      return `${profile.firstName} ${profile.lastName[0]}`;
    },
  },
  async mounted() {
    if (this.profileId) {
      return await this.importSessionForUser();
    }
    if (this.sessionId) {
      return await this.importSessionForRoom();
    }
  },
};
</script>

<style scoped>
#component-name{
  color:var(--clr-gray-2);
}

.circle-btn {
  width: 30px;
  height: 30px;
  text-align: center;
  padding: 6px 0;
  font-size: 12px;
  border-radius: 15px;
  border-width: 0px;
}

.date-dark{
  background-color: var(--clr-accent);
  color: white;
}
</style>
