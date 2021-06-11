<template>
<div class='mt-3 h-100'>
  <transition name="fade">
    <div v-if="showError" class="alert alert-danger fade-in fixed-top" role="alert">
      {{error}}
    </div>
  </transition>
  <transition name="modal">
    <div v-if="showEventCreationDialog" class="modal-mask">
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
            v-on:click="cancelEventCreation" class="btn btn-secondary">
            Close
            </button>
            <button type="button" v-on:click="saveEventCreation" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <transition name="acceptModal">
    <div v-if="showEventAcceptDialog" class="modal-mask">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Proposed Tutoring Session</h5>
            <button
            v-on:click="cancelEventAcceptation"
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
            <button type="button" v-on:click="cannotAttend" class="btn btn-secondary">Cannot Attend</button>
            <button type="button" v-on:click="canAttend" class="btn btn-primary">Attend</button>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <div class='row h-100'>
    <div class='col h-100'>
      <vue-cal
      :events="events"
      active-view="week"
      hide-view-selector
      today-button
      :snap-to-time="15"
      :editable-events="{ title: false, drag: false, resize: false, delete: true, create: create }"
      :on-event-create="onEventCreate"
      :drag-to-create-event="true"
      :selected-date="selectedDate"
      :drag-to-create-threshold="30"
      :disable-views="['years', 'year', 'month', 'day']"
      @view-change="updateEventsShown($event)"
      @ready="updateEventsShown($event)"
      :on-event-click="onEventClick"
      @event-drag-create="createEvent($event)">
        <template v-slot:title="{view}">
          <span v-if="view.id === 'week'">
            {{ view.startDate.toLocaleString('default', { month: 'long', year: 'numeric'}) }}
          </span>
        </template>
        <template v-slot:today-button>
          <!-- Using Vuetify -->
          <button
            v-on:click="setCurrentCalendarDate(new Date())"
            type="button"
            class="btn btn-outline-dark">
            Today
          </button>
        </template>
      </vue-cal>
   </div>
  </div>
</div>
</template>

<script>
import {mapGetters} from 'vuex';
import {v4 as uuidv4} from 'uuid';
import {Session, Client} from '@/api';

const STATE = Object.freeze({
  user: 'user',
  createEvents: 'createEvents',
  selectOne: 'selectOne',
});

export default {
  name: 'calendar',
  props: {
    sessionId: {
      type: Number,
      required: false,
    },
    userId: {
      type: String,
      required: false,
    },
  },
  data: function() {
    return {
      question: null,
      session: null,
      selectedEvent: null,
      state: STATE.createEvents,
      sessionCount: 0,
      showEventCreationDialog: false,
      events: [],
      showEventAcceptDialog: false,
      unauthenticated: false,
      selectedDate: new Date(),
      showError: false,
    };
  },
  computed: {
    create: function() {
      return this.state === STATE.createEvents || this.state === STATE.user;
    },
    newSessionName: function() {
      if (this.state === STATE.user) return 'Personnal Events';
      return 'Session ' + this.sessionCount;
    },
    ...mapGetters('profile', ['currentProfileId']),
  },
  async mounted() {
    if (this.sessionId) {
      await this.setUpSession();
      return;
    }
    this.setUpUser();
  },
  methods: {
    onEventClick(event, e) {
      if (
        event.id !== this.selectedEvent.id ||
        this.state !== STATE.selectOne
      ) return;
      this.showEventAcceptDialog = true;
    },
    cancelEventAcceptation() {
      this.showEventAcceptDialog = false;
    },
    async cannotAttend() {
      await Session.SessionService.bookSession({
        sessionId: this.sessionId,
        canAttend: false,
      });
      return this.$router.go(-1);
    },
    async canAttend() {
      await Session.SessionService.bookSession({
        sessionId: this.sessionId,
        canAttend: true,
      });
      return this.$router.go(-1);
    },
    async updateEventsShown(event) {
      if (this.sessionId) {
        this.events = await Session.SessionService.getRelatedEvents({
          id: this.sessionId,
          start: event.startDate.toISOString(),
          end: event.endDate.toISOString(),
          state: Session.SessionState.SCHEDULED,
        });
      } else if (this.userId) {
        this.events = await Client.ClientService.getEvents({
          id: this.userId,
          start: event.startDate.toISOString(),
          end: event.endDate.toISOString(),
          state: Session.SessionState.SCHEDULED,
        });
      } else {
        throw Error('Cannot get events with session or client id');
      }
      if (this.selectedEvent) {
        this.events.push(this.selectedEvent);
      }
    },
    async saveSession() {
      if (this.sessionId) {
        await Session.SessionService.createSessionEvent({
          sessionId: this.sessionId,
          start: this.selectedEvent.start,
          end: this.selectedEvent.end,
          title: this.selectedEvent.title,
        });
      } else {
        throw error('Client events not implemented yet');
      }
      return this.$router.go(-1);
    },
    createEvent(event) {
      this.selectedEvent = event;
      if (!this.validateNewEvent()) {
        this.deleteEventFunction();
      } else {
        this.showEventCreationDialog = true;
      }
    },
    validateNewEvent() {
      return (
        !this.checkOverlaps(this.selectedEvent) &&
        this.checkEventInFuture(this.selectedEvent)
      );
    },
    setError(error) {
      this.error = error;
      this.showError = true;
      setTimeout(function() {
        this.error = null;
        this.showError = false;
      }.bind(this), 2000);
    },
    setCurrentCalendarDate(date) {
      this.selectedDate = date;
    },
    setUpUser() {
      if (this.userId != this.currentProfileId) {
        this.unauthenticated = true;
        this.error = 'Unauthorized to view other users calendar';
      }
      this.events = this.getEventsForUser(this.currentProfileId);
    },
    async setUpSession() {
      try {
        this.session = await Session.SessionService.get(this.sessionId);
      } catch (error) {
        throw error;
      }

      if (this.session.eventId == null) {
        this.state = STATE.createEvents;
      } else {
        const event = await Session.SessionService.getSessionEvent({
          SessionId: this.session.id,
          id: this.session.eventId,
        });
        this.events.push(event);
        this.state = STATE.selectOne;
        this.setCurrentCalendarDate(event.start);
        this.selectedEvent = event;
        this.showEventAcceptDialog = true;
      }
    },
    onEventCreate(event, deleteEventFunction) {
      this.selectedEvent = event;
      this.deleteEventFunction = deleteEventFunction;

      event.title = this.newSessionName;
      this.sessionCount += 1;
      event.id = uuidv4();
      event.createdAt = new Date();

      return event;
    },
    checkOverlaps(event) {
      const s = Date.parse(event.start);
      const e = Date.parse(event.end);
      let overlaps = false;
      for (let i=0; i < this.events.length; i++) {
        const event2 = this.events[i];
        const s2 = Date.parse(event2.start);
        const e2 = Date.parse(event2.end);
        if (s < s2 && e > s2) {
          overlaps = true;
        } else if (s < e2 && e > e2) {
          overlaps = true;
        }
      }
      if (overlaps) {
        this.setError('The event overlaps with existing events');
      }
      return overlaps;
    },
    checkEventInFuture(event) {
      const s = Date.parse(event.start);
      const future = s >= Date.now();
      if (!future) {
        this.setError('Cannot create an event in the past');
      }
      return future;
    },
    cancelEventCreation() {
      this.showEventCreationDialog = false;
      this.selectedEvent = null;
      this.deleteEventFunction();
    },
    async saveEventCreation() {
      this.events.push(this.selectedEvent);
      await this.saveSession();
      this.showEventCreationDialog = false;
      this.selectedEvent = null;
    },
  },
};
</script>

<style scoped>
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
.btn-circle {
    width: 30px;
    height: 30px;
    padding: 0px 2px;
    border-radius: 15px;
    text-align: center;
    font-size: 12px;
    line-height: 1.42857;
}

.btn-circle.btn-xl {
    width: 70px;
    height: 70px;
    padding: 10px 16px;
    border-radius: 35px;
    font-size: 24px;
    line-height: 1.33;
}
</style>
