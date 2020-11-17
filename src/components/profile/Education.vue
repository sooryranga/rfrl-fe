<template>
  <div id="education" class="shadow p-3 my-3 bg-white">
    <div class="row">
      <div class="col">
        <h3 class="text-left ml-4 my-2"> Education </h3>
      </div>
      <div class="col-2 my-auto addHover">
        <span class="material-icons md-36 md-dark btn-outline-light btn">add</span>
      </div>
    </div>
    <div class="mt-4"  v-for="education in profile.education" v-bind:key="education.id">
      <div class="educationRow row">
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
        <div class="col-1 hover-to-show mr-4" v-if="isLoggedInUser">
          <span class="material-icons md-dark btn-outline-light btn">create</span>
          <span class="material-icons md-dark btn-outline-light btn">drag_handle</span>
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
    ...mapGetters('profile', ['currentProfile']),
    'isLoggedInUser': function() {
      return this.currentProfile.id == this.profileId;
    },
    'profile': function() {
      if (this.profileId == this.currentProfile.id) {
        return this.currentProfile;
      } else {
        return this.currentProfile;
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

<style scoped>
.institutionLogo{
  background-size: cover;
  background-position: top center;
  border-radius:50%;
  background-color: #fff;
  height: 5vh;
  width: 5vh;
}
.hover-to-show{
  visibility:hidden;
  opacity:0;
  transition:opacity 0.5s linear;
}
.educationRow:hover>.hover-to-show
{
  display:block;
  visibility:visible;
  opacity:1;
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
