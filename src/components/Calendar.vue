<template>
<div class='mt-3 h-100'>
  <div class='row h-100'>
    <div class='col-3 p-0'>
      <div>
        <p> {{$route.params.userId}} </p>
      </div>
    </div>
    <div class='col' id="calendar">
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
      ev.data.user = this.$route.params.userId;
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

#calendar{
  height: calc(100% - 80px);
}
</style>
