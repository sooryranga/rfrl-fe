<template>
  <div :v-if="currentProfile.referredClients" class="shadow p-3 my-1 bg-white">
    <h3 class=" ms-4 my-2"> Tutoring Dashboard </h3>
    <div id="previousStudentProfiles">
      <div id="studentPreview">
        <div v-for="student in currentProfile.referredClients" v-bind:key="student.from.id" class="row mb-2">
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

export default {
  name: 'tutor-dashboard',
  props: {
    'currentProfileId': String,
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
  },
  methods: {
    ...mapActions('profile', ['referredClients']),
  },
  mounted: function() {
    this.referredClients();
  },
};
</script>
