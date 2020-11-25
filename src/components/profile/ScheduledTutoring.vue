<template>
  <div v-if="isLoggedInUser" id="scheduledTutoring" class="p-3 my-3 bg-white">
    <div class="row">
      <div class="col">
        <h5 class="text-left my-2">Scheduled Tutoring</h5>
      </div>
    </div>
    <div v-if="scheduledSessions.length">
      <div class="mt-4" v-for="(dateSession,index) in dateScheduledSessions" v-bind:key="index">
        <div class="dateSessionRow row">
          <div class="col-1 my-auto" id="date">
            <div class="btn btn-default btn-circle" v-bind:class="{'btn-primary':isToday(dateSession.date)}">
              {{dateSession.date.getDate()}}
            </div>
          </div>
          <div class="col-2 my-auto">
            <div>{{dateSession.date.getMonth()}},{{toDayOfWeek(dateSession.date.getDay())}}</div>
          </div>
          <div class="col align-middle" id="sessions">
            <div
              class="row h-100"
              v-for="session in dateSession.sessions"
              v-bind:key="session.id">
              <div class="col-4 my-auto">
                <div>{{session.startTime.toLocaleTimeString()}}</div>
              </div>
              <div class="col">
               Session with {{currentProfile.isTutor ? session.mentee.name : sessnion.mentor.name}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="mt-4">
        <p class="text-left"> You haven't scheduled tutoring yet. Give it a try! </p>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {dayOfWeekMapping} from '@/util.js';

export default {
  name: 'scheduled-tutoring',
  props: {
    'profileId': String,
  },
  data: function() {
    return {
      'scheduledSessions': [],
    };
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
    'isLoggedInUser': function() {
      return this.currentProfile.id == this.profileId;
    },
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
    'isToday': function(checkingDate) {
      const today = new Date();
      console.log(today);
      return (
        today.getFullYear() === checkingDate.getFullYear() &&
        today.getMonth() === checkingDate.getMonth() &&
        today.getDate() === checkingDate.getDate()
      );
    },
    'setSessions': function() {
      this.$set(
          this.scheduledSessions,
          0,
          {
            startTime: new Date(),
            mentor: {name: 'Arun'},
            mentee: {name: 'soory'},
          },
      );
    },
    'toDayOfWeek': function(day) {
      return dayOfWeekMapping[day];
    },
  },
  mounted: function() {
    this.setSessions();
    console.log(this.scheduledSessions);
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
