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
            v-on:click="cancelEventCreation" class="btn btn-secondary"
            data-dismiss="modal">Close</button>
            <button type="button" v-on:click="saveEventCreation" class="btn btn-primary">Save changes</button>
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
      @event-drag-create="createEvent"
      @event-delete="deleteLocalyCreatedEvent">
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
  chooseDate: 'chooseDate',
  selectOne: 'selectOne',
  selectMultiple: 'selectMultiple',
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
    saveEvent: {
      type: Function,
      required: true,
    },
    deleteEvent: {
      type: Function,
      required: true,
    },
    // delete
    localSession: {
      type: Object,
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
      locallyCreated: [],
      unauthenticated: false,
      selectedDate: new Date(),
      showError: false,
    };
  },
  computed: {
    create: function() {
      return this.state === STATE.createEvents || this.state === STATE.user;
    },
    title: function() {
      if (this.state === STATE.createEvents) {
        return 'Picked Dates';
      } else if (this.state === STATE.selectOne) {
        return 'Choose a Date from this List';
      }
      return 'Schedule';
    },
    relatedEvents: function() {
      if (this.state === STATE.user) {
        return this.events;
      }
      return this.locallyCreated;
    },
    newSessionName: function() {
      if (this.state === STATE.user) return 'Personnal Events';
      return 'Session ' + this.sessionCount;
    },
    ...mapGetters('profile', ['currentProfile']),
  },
  async mounted() {
    if (this.sessionId) {
      await this.setUpSession();
      return;
    }
    this.setUpUser();
  },
  methods: {
    async updateEventsShown(event) {
      if (this.sessionId) {
        this.events = await Session.SessionService.getRelatedEvents({
          id: this.sessionId,
          startTime: event.startDate.toISOString(),
          endTime: event.endDate.toISOString(),
          state: Session.SessionState.SCHEDULED,
        });
      } else if (this.userId) {
        this.events = await Client.ClientService.getEvents({
          id: this.userId,
          startTime: event.startDate.toISOString(),
          endTime: event.endDate.toISOString(),
          state: Session.SessionState.SCHEDULED,
        });
      } else {
        throw Error('Cannot get events with session or client id');
      }
    },
    async saveSession() {
      if (this.state === STATE.selectMultiple) {
        return await this.selectMultipleEventsFromOptions();
      }
      if (!this.locallyCreated.length) {
        this.setError('Schedule events to save');
        return;
      }
      this.session.scheduledDates = this.locallyCreated;
      await this.saveEvent(this.session);
      return this.$router.go(-1);
    },
    canDelete(event) {
      return this.state === STATE.createEvents;
    },
    canSelect(event) {
      return (
        this.state === STATE.selectOne ||
        this.state === STATE.selectMultiple
      );
    },
    canSave() {
      return (
        this.state === STATE.selectMultiple ||
        this.state === STATE.chooseDate
      );
    },
    deleteEventAction(deletedEvent) {
      this.events = this.events.filter(
          (event) => event.id != deletedEvent.id,
      );
      this.deleteLocalyCreatedEvent(deletedEvent);
    },
    deleteLocalyCreatedEvent(deletedEvent) {
      this.locallyCreated = this.locallyCreated.filter(
          (event) => event.id != deletedEvent.id,
      );
    },
    dateToString(date) {
      return `${date.getDate()+1}/${date.getMonth()+1} `;
    },
    createEvent() {
      console.log(this.validateNewEvent());
      if (!this.validateNewEvent()) {
        this.deleteEventFunction();
      } else {
        this.showEventCreationDialog = true;
      }
    },
    validateNewEvent(event) {
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
      if (this.userId != this.currentProfile.id) {
        this.unauthenticated = true;
        this.error = 'Unauthorized to view other users calendar';
      }
      this.events = this.getEventsForUser(this.currentProfile.id);
    },
    async setUpSession() {
      try {
        this.session = Session.SessionService.get(this.sessionId);
      } catch (error) {
        throw error;
      }

      if (this.session.eventId == null) {
        this.state = STATE.createEvents;
      } else {
        const event = Session.SessionService.getSessionEvent({
          SessionId: this.session.id,
          id: this.session.eventId,
        });
        this.events.push(event);
        this.state = STATE.selectOne;
      }
    },
    async selectMultipleEventsFromOptions() {
      try {
        await Session.SessionService.selectSessionDates(
            this.session.selectedEvents,
            true,
        );
      } catch (error) {
        console.error(error);
      }
      return this.$router.go(-1);
    },
    async selectEventFromOptions(event) {
      if (this.state === STATE.selectOne) {
        try {
          await Session.SessionService.selectSessionDates(
              this.sessionId,
              [event.id],
          );
        } catch (error) {
          console.error(error);
        }
        return this.$router.go(-1);
      }
      if (event.id in this.session.selectedEvents) {
        this.session.selectedEvents.remove(event.id);
      } else {
        this.session.selectedEvents.add(event.id);
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
    saveEventCreation() {
      console.log({...this.selectedEvent});
      this.events.push(this.selectedEvent);
      if (this.state === STATE.createEvents) {
        this.locallyCreated.push({...this.selectedEvent});
      }
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
