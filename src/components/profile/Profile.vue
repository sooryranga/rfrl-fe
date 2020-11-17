<template>
  <div class="row w-75 mx-auto">
    <div class="col-7 overflowContainer">
      <div class="shadow p-3 my-4 pt-5 pb-4 bg-white">
        <div class="row">
          <div class="col-3">
            <img class="profilePicture" v-bind:src="profile.profileImage"/>
            <div v-if="bookTutorButton">
              <router-link class="btn btn-dark p-2 mr-2"  :to="bookTutorRoute">Book Tutor</router-link>
            </div>
          </div>
          <div class="col">
            <h3 class="text-left">{{profile.name}}</h3>
            <h4 class="text-left text-uppercase"> About </h4>
            <p class="text-left">{{profile.about}}</p>
          </div>
          <div class="col-2" v-if="isLoggedInUser">
            <span class="material-icons md-dark btn-outline-light btn">create</span>
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
    'isLoggedInUser': function() {
      return this.currentProfile.id == this.$route.params.userId;
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
/* Rules for sizing the icon. */
.material-icons.md-18 { font-size: 18px; }
.material-icons.md-24 { font-size: 24px; }
.material-icons.md-36 { font-size: 36px; }
.material-icons.md-48 { font-size: 48px; }

/* Rules for using icons as black on a light background. */
.material-icons.md-dark { color: rgba(0, 0, 0, 0.54); }
.material-icons.md-dark.md-inactive { color: rgba(0, 0, 0, 0.26); }

/* Rules for using icons as white on a dark background. */
.material-icons.md-light { color: rgba(255, 255, 255, 1); }
.material-icons.md-light.md-inactive { color: rgba(255, 255, 255, 0.3); }
</style>
