<template>
  <div class="row w-75 mx-auto">
    <div class="col-7 overflowContainer">
      <div class="shadow p-3 my-3 bg-white">
        <div class="row">
          <div class="col-3">
            <img class="profilePicture" v-bind:src="profile.profileImage"/>
            <div v-if="bookTutorButton">
              <router-link class="btn btn-dark p-2 mr-2"  :to="bookTutorRoute">Book Tutor</router-link>
            </div>
          </div>
          <div class="col-6">
            <h3 class="text-left">{{profile.name}}</h3>
            <h4 class="text-left text-uppercase"> About </h4>
            <p class="text-left">{{profile.about}}</p>
          </div>
        </div>
      </div>
      <education v-bind:profile-id="$route.params.userId"></education>
      <documents v-bind:profile-id="$route.params.userId"></documents>
      <tutor-dashboard v-bind:profile-id="$route.params.userId"></tutor-dashboard>
      <tutor-review v-bind:profile-id="$route.params.userId"></tutor-review>
    </div>
    <div class="col">
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {profileState} from '@/constants.state.js';

export default {
  name: 'tutor',
  data: function() {
    return {
      profile: profileState(),
    };
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
    'bookTutorRoute': function() {
      return {
        name: 'Calendar',
        params: {userId: this.profile.id},
      };
    },
    'bookTutorButton': function() {
      return this.profile.isTutor &&
      (this.profile.id === this.currentProfile.id);
    },
  },
  beforeMount: function() {
    if (this.$route.params.userId == this.currentProfile.id) {
      this.profile = this.currentProfile;
    } else {
      console.log('get profile');
      this.profile = this.currentProfile;
    }
  },
};
</script>

<style>
.profilePicture{
  background-size: cover;
  background-position: top center;
  border-radius: 50%;
  background-color: #fff;
  padding: 4px;
  height: 5vh;
  width: 5vh;
}
.studentPicture{
  background-size: cover;
  background-position: top center;
  border-radius:50%;
  background-color: #fff;
  height: 5vh;
  width: 5vh;
}
.overflowContainer{
  max-height:93vh;
  overflow-y:scroll;
}
</style>
