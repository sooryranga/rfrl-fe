<template>
  <div class="h-100 pt-3 container-xl overflow-auto">
    <div class="row p-3 my-3">
      <div class="col my-auto">
        <h4 class="ml-4 my-2"> Tutoring Session </h4>
      </div>
      <div class="col">
        <button class="btn btn-secondary">Start Session</button>
      </div>
    </div>
    <div class="shadow p-3 my-3 bg-white">
      <div class="row">
        <div class="col">
          <h4 class="ml-4 my-2"> Payment </h4>
        </div>
      </div>
    </div>
    <div class="shadow p-3 my-3 bg-white">
      <div class="row">
        <div class="col">
          <h4 class="ml-4 my-2"> Date and time </h4>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="row" style="height: 250px">
            <div class="col my-auto mx-auto">
              <div>
                <button class="btn btn-secondary mr-2"> View </button>
                <button class="btn btn-secondary"> Reschedule </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <vue-cal
            style="height: 250px"
            hide-title-bar
            :events="events"
            active-view="week"
            hide-view-selector
            :time-from="timeFrom"
            :time-to="timeTo"
            :hide-weekdays="hideWeekdays"
            :editable-events="{ title: false, drag: false, resize: false, delete: false, create: false }"
            :selected-date="selectedDate"
            :disable-views="['years', 'year', 'month', 'day']"
          >
              <template v-slot:title="{view}">
                <span v-if="view.id === 'week'">
                  {{ view.startDate.toLocaleString('default', { month: 'long', year: 'numeric'}) }}
                </span>
              </template>
          </vue-cal>
        </div>
      </div>
    </div>
    <documents :sessionId="sessionId"/>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {SessionService} from '@/api/SessionService';

export default {
  name: 'session-info',
  data: function() {
    return {
      session: null,
      events: [],
    };
  },
  props: {
    sessionId: {
      type: String,
      required: false,
    },
    localSession: {
      type: Object,
      required: false,
    },
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
    selectedDate: function() {
      return this.session?.startTime;
    },
    hideWeekdays: function() {
      let day = this.session?.startTime.getDay();
      // vucal starts from monday 1 to sunday 7
      // getDay starts from sunday 0 to saturday 6
      day = day === 0? 7: day;

      console.log(day);

      return [...Array(8).keys()].filter((filterDay) => {
        if (filterDay === 0) return true;
        if (day+1 === 8 && filterDay === 5) return false;
        if (day-1 === 0 && filterDay === 3) return false;
        return day+1 < filterDay || day -1 > filterDay;
      });
    },
    timeFrom: function() {
      return Math.max(this.session?.startTime.getHours()-1, 0)*60;
    },
    timeTo: function() {
      return Math.min(this.session?.endTime.getHours()+1, 24)*60;
    },
  },
  mounted: async function() {
    try {
      this.session = await SessionService.get(this.sessionId);
    } catch (error) {
      console.error(error);
      this.session = this.localSession;
    }

    this.events.push( {
      'start': this.session.startTime,
      'end': this.session.endTime,
      'title': 'Session',
      'id': this.session.id,
    });
  },
};
</script>
