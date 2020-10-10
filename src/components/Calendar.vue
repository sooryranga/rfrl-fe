<template>
<div class='container-fluid mt-3'>
  <div class='container-fluid h-100 mt-0'>
    <div class='row h-100'>
      <div class='col col-3 p-0'>
        <div>
          <p> {{$route.params.user_id}} </p>
        </div>
      </div>
      <div class='col'>
        <v-app id="dayspan" v-cloak>
          <calendar-extension
            :calendar="calendar"
            :events="events"
            ref="app"
            @change="saveState"
            @event-create="eventCreate"
            @event-update="eventUpdate"
            @event-remove="eventRemove"
          >
          </calendar-extension>
        </v-app>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {Calendar} from 'dayspan';
import {v1 as uuidv1} from 'uuid';

import {mapGetters} from 'vuex';

export default {
  name: 'calendar',
  data: function() {
    return {
      events: [],
      state: {events: []},
      calendar: Calendar.weeks(),
    };
  },
  mounted() {},
  computed: mapGetters(['currentUser']),
  methods: {
    eventCreate(ev) {
      ev.data.description='Tutoring session scheduled';
      ev.data.user = this.$route.params.user_id;
      ev.data.id = uuidv1();
      console.log(ev);
    },
    eventUpdate(ev) {
      console.log(ev);
    },
    eventRemove(ev) {
      console.log(ev);
    },
    saveState: function(ev) {
      if (ev.details) {
        ev.details.description = 'test2';
      }
      if (ev.targetDetails) {
        ev.targetDetails.description = 'test';
      }

      const state = this.calendar.toInput(true);
      console.log(state);
    },
  },
};
</script>

<style scoped>
.selectable{list-style-type: none;}
.selectablerows{ border-top: 0px; border-left: 0px; border-right: 0px;}
.selectablerows.ui-selecting { background: #93969a; }
.selectablerows.ui-selected { border-bottom:0px }
.scheduled{background: #3a3b3d; color:white}
</style>
