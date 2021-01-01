<template>
  <div id="education" class="shadow p-3 my-3 bg-white">
    <education-editor
      :educationprop="this.editingItem"
      v-if="editorOpen"
      v-on:saveEvent="saveEvent"
      v-on:cancelEvent="cancelEvent"
    ></education-editor>
    <div class="row">
      <div class="col">
        <h4 class="text-left ml-4 my-2"> Education </h4>
      </div>
      <div class="col-2 my-auto addHover">
        <span
          v-if="isLoggedInUser"
          v-on:click="add"
          class="material-icons md-24 md-dark btn-outline-light btn"
        >add</span>
      </div>
    </div>
    <div class="mt-4"  v-for="(education, index) in profile.education" v-bind:key="education.id">
      <div class="educationRow row">
        <div class="col-3 my-auto">
          <img class="institutionLogo" v-bind:src="education.institutionLogo"/>
        </div>
        <div class="col my-auto text-left">
          <h5>{{education.institution}}</h5>
          <h6>{{education.degree}}</h6>
          <p class="m-0">{{education.fieldOfStudy}}</p>
          <p class="m-0"><small>{{education.start.getFullYear()}}-{{education.end.getFullYear()}}</small></p>
          <hr class="my-1"/>
        </div>
        <div class="col-1 hover-to-show mr-4" v-if="isLoggedInUser">
          <span v-on:click="edit(index)" class="material-icons md-dark btn-outline-light btn">create</span>
          <span class="material-icons md-dark btn-outline-light btn">drag_handle</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {EDUCATION, ADD_EDUCATION} from '@/constants.actions.js';
import EducationEditor from '@/components/profile/EducationEditor.vue';
import {educationState} from '@/constants.state.js';

export default {
  name: 'education',
  props: {
    'profileId': String,
  },
  data: function() {
    return {
      'editorOpen': false,
      'localEducation': [],
      'editingIndex': null,
      'editingItem': educationState(),
    };
  },
  components: {'education-editor': EducationEditor},
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
    ...mapActions('profile', [EDUCATION, ADD_EDUCATION]),
    'clearEditorState': function() {
      this.editorDocument = educationState();
    },
    'cancelEvent': function() {
      this.clearEditorState();
      this.editorOpen = false;
    },
    'add': function() {
      this.editingItem = educationState();
      this.editorOpen = true;
      this.editingIndex = null;
    },
    'edit': function(index) {
      this.editingIndex = index;
      this.editingItem = this.localEducation[index];
      this.editorOpen = true;
    },
    'saveEvent': function(state) {
      this.editorOpen = false;
      this.saveItem(state);
    },
    'saveItem': function(state) {
      this[ADD_EDUCATION]({
        index: this.editingIndex,
        newEducation: state,
      });

      if (this.editingIndex != null) {
        this.localEducation[this.editingIndex] = state;
      } else {
        this.localEducation.push(state);
      }

      this.clearEditorState();
    },
  },
  mounted: function() {
    if (this.isLoggedInUser) {
      if (this.currentProfile.education.length == 0) {
        this[EDUCATION]();
      }
      this.localEducation.push(...this.currentProfile.education);
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
