<template>
  <div :v-if="currentProfile.isTutor" class="shadow p-3 my-1 bg-white">
    <h3 class="text-left ml-4 my-2"> Tutoring Dashboard </h3>
    <div class="mt-4" id="tutorStatus">
      <!-- Chart showing previous tutoring session -->
    </div>
    <div id="previousStudentProfiles">
      <div id="studentPreview">
        <div v-for="student in currentProfile.tutoredStudents" v-bind:key="student.currentProfileId" class="row mb-2">
          <div class="col-3 my-auto">
            <img v-bind:src="student.image" class="studentPicture"/>
          </div>
          <div class="col my-auto">
            <h5 class="text-left mb-1">{{student.name}}</h5>
            <p class="text-left mb-0"><small>{{student.lastTutoredDate.toDateString()}}</small></p>
            <hr class="my-0"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {TUTORED_STUDENTS} from '@/constants.actions.js';

export default {
  name: 'tutor-dashboard',
  props: {
    'currentProfileId': String,
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
  },
  methods: {
    ...mapActions('profile', [TUTORED_STUDENTS]),
  },
  mounted: function() {
    this[TUTORED_STUDENTS]();
  },
};
</script>
