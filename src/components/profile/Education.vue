<template>
  <div v-if="profile.education" id="education" class="shadow p-3 my-3 bg-white">
    <h3 class="text-left ml-4 my-2"> Education </h3>
    <div v-for="education in profile.education" v-bind:key="education.id">
      <div class="row">
        <div class="col-3 my-auto">
          <img class="institutionLogo" v-bind:src="education.institutionLogo"/>
        </div>
        <div class="col my-auto text-left">
          <h5>{{education.institution}}</h5>
          <h6>{{education.degree}}</h6>
          <p>{{education.fieldOfStudy}}</p>
          <p><small>{{education.start}}-{{education.end}}</small></p>
          <hr class="my-0"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {EDUCATION} from '@/constants.actions.js';

export default {
  name: 'education',
  props: {
    'profileId': String,
  },
  computed: {
    ...mapGetters('profile', ['getProfile']),
    'isLoggedInUser': function() {
      return this.getProfile.id == this.profileId;
    },
    'profile': function() {
      if (this.profileId == this.getProfile.id) {
        return this.getProfile;
      } else {
        return this.getProfile;
      }
    },
  },
  methods: {
    ...mapActions('profile', [EDUCATION]),
  },
  mounted: function() {
    if (this.isLoggedInUser) {
      this[EDUCATION]();
    }
  },
};
</script>

<style>
.institutionLogo{
  background-size: cover;
  background-position: top center;
  border-radius:50%;
  background-color: #fff;
  height: 5vh;
  width: 5vh;
}
</style>
