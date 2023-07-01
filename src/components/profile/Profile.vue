<template>
  <div class="row w-75 mx-auto">
    <div class="col-7 overflowContainer">
      <profile-about v-bind:profile-id="$route.params.userId"></profile-about>
      <education v-bind:profile-id="$route.params.userId"></education>
      <documents v-bind:profile-id="$route.params.userId"></documents>
      <tutor-dashboard v-bind:profile-id="$route.params.userId"></tutor-dashboard>
      <tutor-review v-bind:profile-id="$route.params.userId"></tutor-review>
    </div>
    <div class="col">
      <scheduled-tutoring v-bind:profile-id="$route.params.userId"></scheduled-tutoring>
      <answered-questions v-bind:profile-id="$route.params.userId"></answered-questions>
      <asked-questions v-bind:profile-id="$route.params.userId"></asked-questions>
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
    'isLoggedInUser': function() {
      return this.currentProfile.id == this.$route.params.userId;
    },
  },
  beforeMount: function() {
    if (this.$route.params.userId == this.currentProfile.id) {
      this.profile = this.currentProfile;
    } else {
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
