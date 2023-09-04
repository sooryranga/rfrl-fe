
<template>
  <div id="scheduledTutoring">
    <div class="row">
      <div class="col">
        <h6 class="my-2">Scheduled Tutoring</h6>
      </div>
    </div>
    <div v-if="scheduledSessions.length">
      <div class="row mt-1 h-100" v-for="(dateSession,index) in dateScheduledSessions" v-bind:key="index">
        <div class="col-1 my-1" id="date">
          <div
            class="btn btn-default btn-circle"
            v-bind:class="[isToday(dateSession.date) ?'btn-primary': 'btn-light']">
            {{dateSession.date.getDate()}}
          </div>
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
                  <div><p class="m-0">{{session.startTime.toLocaleTimeString()}}</p></div>
                </div>
                <div class="col-auto my-auto">
                  <p class="m-0">
                    With {{currentProfile.id === session.mentor.id ? session.mentee.name : session.mentor.name}}
                  </p>
                </div>
              </div>
              <div v-else class="row">
                <div class="col my-auto">
                  <div><p class="m-0">{{session.startTime.toLocaleTimeString()}}</p></div>
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
import {SessionService} from '@/api/SessionService.js';

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
  data: function() {
    return {
      'scheduledSessions': [],
    };
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
    'dateScheduledSessions': function() {
      if (this.scheduledSessions.length == 0) {
        return [];
      }

      let _date = this.scheduledSessions[0].startTime;
      _date.setHours(0, 0, 0, 0);
      const cache = [{date: _date, sessions: []}];

      for (let i = 0; i < this.scheduledSessions.length; i++) {
        const session = this.scheduledSessions[i];
        const _compDate = session.startTime;
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
  methods: {
    goToEvent(session) {
      this.$router.push({
        name: 'session-info',
        params: {sessionId: session.id, localSession: session},
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
      this.scheduledSessions = await SessionService.getSessionForProfile(
          this.profileId,
      );
    },
    async importSessionForRoom() {
      this.scheduledSessions = await SessionService.getScheduledSessions(
          this.roomId,
      );
    },
  },
  mounted: async function() {
    try {
      if (this.profileId) await importSessionForUser();
      if (this.roomId) await importSessionForRoom();
    } catch (error) {
      console.error(error);
      this.scheduledSessions.push({
        startTime: new Date('2021-02-01T03:45:00.086Z'),
        endTime: new Date('2021-02-01T04:15:00.086Z'),
        mentor: {id: this.currentProfile.id, name: 'Arun'},
        mentee: {name: 'Sathi'},
        id: '1',
      });
      this.scheduledSessions.push({
        startTime: new Date('2021-02-26T03:45:00.086Z'),
        endTime: new Date('2021-02-26T04:15:00.086Z'),
        mentor: {id: this.currentProfile.id, name: 'Arun'},
        mentee: {name: 'Soory'},
        id: '2',
      });
      this.scheduledSessions.push({
        startTime: new Date('2021-11-26T03:45:00.086Z'),
        endTime: new Date('2021-11-26T04:15:00.086Z'),
        mentor: {id: '622bccca-2449-4774-a926-dfb984dc530d', name: 'Arun'},
        mentee: {name: 'TJ'},
        id: '3',
      });
    }
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
