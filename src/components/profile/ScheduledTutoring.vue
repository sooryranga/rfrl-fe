<template>
  <v-container>
    <v-row no-gutters>
      <v-col class="p-0">
        <h6 class="my-2">Scheduled Tutoring</h6>
      </v-col>
    </v-row>
    <div v-if="scheduledSessions.length" class="w-100">
      <v-row no-gutters class="mt-1 h-100" v-for="(dateSession,index) in dateScheduledSessions" v-bind:key="index">
        <v-col cols="1" class="p-0 h-100" id="date">
          <v-btn
            x-small
            fab
            :color="isToday(dateSession.date) ?'primary' : 'transparent'"
          >
          {{dateSession.date.getDate()}}
          </v-btn>
        </v-col>
        <v-col cols="3">
          <div class="text-center my-auto">{{dateSession.date.getMonth()}} {{toDay(dateSession.date.getDay())}}</div>
        </v-col>
        <v-col class="align-middle h-100" id="sessions">
          <v-row no-gutters
            class="w-100 mb-1"
            v-for="session in dateSession.sessions"
            v-bind:key="session.id">
            <v-btn
            class="w-100"
            outline
            color="secondary"
            v-on:click="goToEvent(session)">
              <v-row no-gutters>
                <div class="col-6 my-auto">
                  <div><p class="m-0">{{session.startTime.toLocaleTimeString()}}</p></div>
                </div>
                <div class="col my-auto">
                  <p class="m-0">
                    With {{currentProfile.id === session.mentor.id ? session.mentee.name : session.mentor.name}}
                  </p>
                </div>
              </v-row>
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <div class="mt-4">
        <p> You haven't scheduled tutoring yet. Give it a try! </p>
      </div>
    </div>
  </v-container>
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
        startTime: new Date(),
        mentor: {id: this.currentProfile.id, name: 'Arun'},
        mentee: {name: 'Sathi'},
        id: '1',
      });
      this.scheduledSessions.push({
        startTime: new Date('2021/11/25'),
        mentor: {id: this.currentProfile.id, name: 'Arun'},
        mentee: {name: 'Soory'},
        id: '2',
      });
      this.scheduledSessions.push({
        startTime: new Date('2021/11/26'),
        mentor: {id: '622bccca-2449-4774-a926-dfb984dc530d', name: 'Arun'},
        mentee: {name: 'TJ'},
        id: '3',
      });
    }
  },
};
</script>

<style>
</style>
