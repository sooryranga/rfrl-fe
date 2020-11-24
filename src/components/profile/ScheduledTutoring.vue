<template>
  <div v-if="isLoggedInUser" id="scheduledTutoring" class="p-3 my-3 bg-white">
    <div class="row">
      <div class="col">
        <h5 class="text-left my-2">Scheduled Tutoring</h5>
      </div>
    </div>
    <div class="mt-4" v-for="dateSession in dateScheduledSessions" v-bind:key="dateSession.date">
      <div class="dateSessionRow row">
        <div class="col-2" id="date">
          <div class="btn btn-default btn-circle" v-bind:class="{'btn-primary':isToday(dateSession.date)}">
            {{dateSession.date.getDate()}}
          </div>
          {{dateSession.date.getMonth()}},
          {{dateSession.date.getDay()}}
        </div>
        <div class="col" id="sessions">
          <div
            class="mt-1 row"
            v-for="(session, index) in dateSession.sessions"
            v-bind:key="session.id">
            <div class="col-2">
              {{session.startTime.toLocaleTimeString()}}
            </div>
            <div class="col">
              {{currentProfile.isTutor ? session.mentee.name : sessnion.mentor.name}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'scheduled-tutoring',
  props: {
    'profileId': String,
  },
  computed: {
    'isLoggedInUser': function() {
      return this.currentProfile.id == this.profileId;
    },
    'dateScheduledSessions': function() {
      if (this.scheduledSessions.length == 0) {
        return [];
      }

      const _date = this.scheduledSessions[0].startTime;
      _date.setHours(0, 0, 0, 0);
      const cache = [{date: _date, sessions: []}];

      for (let i = 0; i < this.scheduledSessions.length; i++) {
        const session = this.scheduledSessions[i];
        const _compDate = session.startTime;
        _compDate.setHours(0, 0, 0, 0);

        if (_compDate > _date) {
          cache.append({date: _date, sessions: []});
          _date = _compDate;
        }
        cache[-1].sessions.push(session);
      }
      return cache;
    },
  },
  methods: {
    'isToday': function(checkingDate) {
      const today = Date.now();
      return (
        today.getFullYear() === checkingDate.getFullYear() &&
        today.getMonth() === checkingDate.getMonth() &&
        today.getDate() === checkingDate.getDate()
      );
    },
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
