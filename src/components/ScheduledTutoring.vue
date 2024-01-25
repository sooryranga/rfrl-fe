
<template>
  <div id="scheduled-tutoring">
    <h5 id="component-name">Scheduled Tutoring</h5>
    <div v-if="scheduledSessions.length">
      <div class="mt-1" v-for="(dateSession,index) in dateScheduledSessions" v-bind:key="index">
        <div
            class="mb-1 sections-container"
            v-for="(session,index) in dateSession.sessions"
            v-bind:key="session.id">
          <button
            class="circle-btn"
            v-bind:class="[isToday(dateSession.date) ?'date-dark': 'date-light', index===0 ? 'opaque': 'transparent']">
            {{dateSession.date.getDate()}}
          </button>
          <div class="text-center month-txt">{{toMonth(dateSession.date.getMonth())}}</div>
          <button
          class="primary-btn primary-btn-light event-button"
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
    <div v-else>
      <div class="mt-4">
        <p> You haven't scheduled tutoring yet. Give it a try! </p>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {monthOfYearMapping} from '@/utils.js';
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
        const _compDate = new Date(session.event.start.getTime());
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
    toMonth(month) {
      return monthOfYearMapping[month];
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
  font-weight: 400;
  font-size: 1.5rem;
  padding-bottom: 1rem;
  color:white;
}

#scheduled-tutoring{
  margin-top: 2rem;
  padding-right: 1rem;
}

.sections-container{
  align-items: center;
  display: flex;
  flex-direction:row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  padding-top: 0.2rem;
}
.month-txt{
  padding-left: 2rem;
  padding-right: 2rem;
  color:white;
}

.event-button{
  width:100%;
  max-width:18rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.circle-btn {
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  text-align: center;
  padding: 6px 6px;
  font-size: 12px;
  border-radius: 50%;
  border-width: 0px;
}

.date-dark{
  background-color: var(--clr-accent);
  color: white;
}

.opaque{
  opacity: 1;
}

.transparent{
  opacity: 0;
}
</style>
