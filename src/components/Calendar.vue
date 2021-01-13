<template>
<div class='mt-3 h-100'>
  <transition name="modal">
    <div v-if="showEventCreationDialog" class="modal-mask text-left">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Tutoring Session</h5>
            <button
            v-on:click="cancelEventCreation"
            type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-2">
                <p>Session</p>
              </div>
              <div class="col">
                <p>{{selectedEvent.title}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <p>Start</p>
              </div>
              <div class="col">
                <p>{{selectedEvent.start.toLocaleString()}}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-2">
                <p>End</p>
              </div>
              <div class="col">
                <p>{{selectedEvent.end.toLocaleString()}}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button"
            v-on:click="cancelEventCreation" class="btn btn-secondary"
            data-dismiss="modal">Close</button>
            <button type="button" v-on:click="saveEventCreation" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <div class='row h-100'>
    <div class='col-4 p-0'>
      <div>
        <p> {{$route.params.userId}} </p>
      </div>
    </div>
    <div class='col' id="calendar">
      <vue-cal
      :events="events"
      active-view="week"
      hide-view-selector
      :snap-to-time="15"
      :editable-events="{ title: false, drag: false, resize: false, delete: true, create: create }"
      :on-event-create="onEventCreate"
      :drag-to-create-event="true"
      @event-drag-create="createEvent"
      :drag-to-create-threshold="30"
      :disable-views="['years', 'year', 'month', 'day']">
      <template v-slot:title="{view }">
        <span v-if="view.id === 'week'">
          {{ view.startDate.toLocaleString('default', { month: 'long', year: 'numeric'}) }}
        </span>
      </template>
      </vue-cal>
   </div>
  </div>
</div>
</template>

<script>
import {mapGetters} from 'vuex';
import {v4 as uuidv4} from 'uuid';

const STATE = Object.freeze({
  user: 'user',
  pickDates: 'pickDates',
  chooseDate: 'chooseDate',
});

export default {
  name: 'calendar',
  props: {
    sessionId: {
      type: String,
      required: false,
    },
    userId: {
      type: String,
      required: false,
    },
    saveEvent: {
      type: Function,
      required: true,
    },
    deleteEvent: {
      type: Function,
      required: true,
    },
  },
  data: function() {
    return {
      question: null,
      session: null,
      selectedEvent: null,
      state: STATE.pickDates,
      sessionCount: 0,
      showEventCreationDialog: false,
      events: [],
      locallyCreated: [],
      unauthenticated: false,
    };
  },
  computed: {
    create: function() {
      return this.state === STATE.pickDates || this.state === STATE.user;
    },
    newSessionName: function() {
      if (this.state === STATE.user) return 'Personnal Events';
      return 'Session ' + this.sessionCount + 1;
    },
    ...mapGetters('profile', ['currentProfile']),
  },
  mounted() {
    if (this.sessionId) {
      this.setUpSession();
      return;
    }
    this.setUpUser();
  },
  methods: {
    createEvent() {
      if (this.checkOverlaps(this.selectedEvent)) {
        this.deleteEventFunction();
      } else {
        this.showEventCreationDialog = true;
      }
    },
    setUpUser() {
      if (this.userId != this.currentProfile.id) {
        this.unauthenticated = true;
        this.error = 'Unauthorized to view other users calendar';
      }
      this.events = this.getEventsForUser(this.currentProfile.id);
    },
    setUpSession() {
      // this.session = this.getSession(this.sessionId);
      // this.state = this.session.state;

      // const userIds = this.session.users.map((user) => user.id);
      // userEvents = this.getEventsForSession(this.sessionId);

      // this.events = [
      //   {
      //     start: '2021-01-12 14:00',
      //     end: '2021-01-12 17:30',
      //     title: 'Boring event',
      //     content: 'Hello',
      //     class: 'blue-event',
      //     deletable: false,
      //     resizable: false,
      //     draggable: false,
      //   },
      // ];
    },
    onEventCreate(event, deleteEventFunction) {
      this.selectedEvent = event;
      this.deleteEventFunction = deleteEventFunction;

      event.title = this.newSessionName;
      event.id = uuidv4();
      event.createdAt = new Date();

      return event;
    },
    checkOverlaps(event) {
      const s = Date.parse(event.start);
      const e = Date.parse(event.end);
      for (let i=0; i < this.events.length; i++) {
        const event2 = this.events[i];
        const s2 = Date.parse(event2.start);
        const e2 = Date.parse(event2.end);
        if (s < s2 && e > s2) {
          return true;
        } else if (s < e2 && e > e2) {
          return true;
        }
      }
      return false;
    },
    cancelEventCreation() {
      this.showEventCreationDialog = false;
      this.selectedEvent = null;
      this.deleteEvent = null;
      this.deleteEventFunction();
    },
    saveEventCreation() {
      this.events.push(this.selectedEvent);
      if (this.state === STATE.pickDates) {
        this.createdEvents.push({...this.selectedEvent});
      }
      this.saveEvent({...this.selectedEvent});
      this.showEventCreationDialog = false;
      this.selectedEvent = null;
      this.deleteEvent = null;
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
  height: calc(100% - 5px);
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>
