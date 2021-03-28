<template>
  <div :v-if="currentProfile.tutoredStudents" class="shadow p-3 my-1 bg-white">
    <h3 class=" ml-4 my-2"> Tutoring Dashboard </h3>
    <div id="previousStudentProfiles">
      <div id="studentPreview">
        <div v-for="student in currentProfile.tutoredStudents" v-bind:key="student.currentProfileId" class="row mb-2">
          <div class="col-3 my-auto">
            <img v-bind:src="student.image" class="studentPicture"/>
          </div>
          <div class="col my-auto">
            <h5 class=" mb-1">{{student.name}}</h5>
            <p class=" mb-0"><small>{{student.lastTutoredDate.toDateString()}}</small></p>
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
