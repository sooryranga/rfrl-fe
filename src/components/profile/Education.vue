
<template>
  <div id="education" class="shadow p-3 my-3 bg-white">
    <education-editor
      v-if="editorOpen"
      v-on:saveEvent="saveEvent"
      v-on:cancelEvent="cancelEvent"
    ></education-editor>
    <div class="row">
      <div class="col">
        <h4 class=" ml-4 my-2"> Education </h4>
      </div>
      <div class="col-2 my-auto addHover">
        <span
          v-if="isLoggedInUser"
          v-on:click="add"
          class="material-icons md-24 md-dark btn-outline-light btn"
        >create</span>
      </div>
    </div>
    <div class="mt-4"  v-if="profile">
      <div class="educationRow row">
        <div class="col-3 my-auto">
          <img class="institutionLogo" src="https://tinyurl.com/54ze666n"/>
        </div>
        <div class="col my-auto ">
          <h5>{{profile.institution}}</h5>
          <h6>{{profile.degree}}</h6>
          <p class="m-0">{{profile.fieldOfStudy}}</p>
          <p class="m-0">
            <small>{{profile.startYear}}-{{profile.endYear}}</small>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import EducationEditor from '@/components/profile/EducationEditor.vue';
import {Profile} from '@/api';

export default {
  name: 'education',
  props: {
    profileId: String,
  },
  data: function() {
    return {
      editorOpen: false,
      fetchedProfile: null,
    };
  },
  components: {'education-editor': EducationEditor},
  computed: {
    ...mapGetters('profile', ['currentProfile']),
    isLoggedInUser() {
      return this.currentProfile.id === this.profileId;
    },
    profile() {
      if (this.isLoggedInUser) {
        return this.currentProfile;
      } else {
        return this.fetchedProfile;
      }
    },
  },
  methods: {
    ...mapActions('profile', ['setEducation']),
    cancelEvent() {
      this.editorOpen = false;
    },
    add() {
      this.editorOpen = true;
      this.editingIndex = null;
    },
    saveEvent(state) {
      this.editorOpen = false;
      this.saveItem(state);
    },
    saveItem({institution, degree, fieldOfStudy, startYear, endYear}) {
      this.setEducation(
          {institution, degree, fieldOfStudy, startYear, endYear},
      );
    },
  },
  async mounted() {
    if (!this.isLoggedInUser) {
      this.fetchedProfile = await Profile.ProfileService.get(this.profileId);
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
