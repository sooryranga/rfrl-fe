
<template>
  <div id="education" class="shadow p-3 my-3 bg-white">
    <div class="mx-4">
      <loading :active.sync="isLoading"/>
      <div v-if="!isLoading">
        <education-editor
          v-if="editorOpen"
          v-on:saveEvent="saveEvent"
          v-on:cancelEvent="cancelEvent"
        ></education-editor>
        <div class="row">
          <div class="col">
            <h4 class="my-2 primary-color"> Education </h4>
          </div>
          <div class="col-2 section-button-container">
            <button class="no-styling-button section-button"><span
              v-if="isLoggedInUser"
              v-on:click="add"
              class="material-icons section-button-span"
            >create</span></button>
          </div>
        </div>
        <div class="mt-1"  v-if="profile">
          <div class="educationRow row">
            <div class="col-3 my-auto">
              <img class="institutionLogo" src="https://tinyurl.com/54ze666n"/>
            </div>
            <div class="col my-auto">
              <p id="institution-name">{{profile.institution}}</p>
              <p id="degree">{{profile.degree}}</p>
              <p id="field-of-study">{{profile.fieldOfStudy}}</p>
              <p id="start-and-end-year">{{profile.startYear}}-{{profile.endYear}}</p>
            </div>
          </div>
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
    fetchedProfile: Object,
  },
  data: function() {
    return {
      editorOpen: false,
      otherProfile: null,
    };
  },
  components: {'education-editor': EducationEditor},
  computed: {
    ...mapGetters('profile', ['currentProfile']),
    isLoggedInUser() {
      return this.currentProfile.id === this.profileId;
    },
    isLoading() {
      return this.profile === null;
    },
    profile() {
      if (this.isLoggedInUser) {
        return this.currentProfile;
      } else {
        return this.otherProfile;
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
      if (this.fetchedProfile) {
        this.otherProfile = this.fetchedProfile;
      } else {
        this.otherProfile = await Profile.ProfileService.get(this.profileId);
      }
    }
  },
};
</script>

<style scoped>
#institution-name{
  font-size: 1.3rem;
  margin-bottom: 0;
}
#degree{
  font-size: 0.9rem;
  margin-bottom: 0;
}
#field-of-study{
  font-size: 0.9rem;
  margin-bottom: 0;
}
#start-and-end-year{
  font-size: 0.6rem;
  letter-spacing: 2px;
}

.institutionLogo{
  height: 5rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
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
