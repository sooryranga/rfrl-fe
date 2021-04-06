<template>
  <div class="shadow p-3 my-4 pt-5 pb-4 bg-white">
    <about-editor
      v-if="editorOpen"
      v-on:closeEditor="closeEditor"
    ></about-editor>
    <div class="row">
      <div class="col-3">
        <img class="profilePicture" v-bind:src="profile.photo"/>
        <div v-if="bookTutorButton">
          <router-link class="btn btn-dark p-2 mr-2"  :to="bookTutorRoute">Book Tutor</router-link>
        </div>
      </div>
      <div class="col">
        <h4 class="">{{profile.firstName}} {{profile.lastName}}</h4>
        <p class="">{{profile.about}}</p>
      </div>
      <div class="col-2" v-if="isLoggedInUser">
        <span v-on:click="edit" class="material-icons md-dark btn-outline-light btn">create</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import AboutEditor from '@/components/profile/AboutEditor.vue';
import {profileState} from '@/constants.state.js';

export default {
  name: 'document',
  components: {'about-editor': AboutEditor},
  data: function() {
    return {
      'editorOpen': false,
      'profile': profileState(),
    };
  },
  props: {
    profileId: String,
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
    ...mapGetters('tutors', ['getTutor']),
    isLoggedInUser() {
      return this.currentProfile.id === this.profileId;
    },
    bookTutorRoute() {
      return {
        name: 'profile-calendar',
        params: {userId: this.profile.id},
      };
    },
  },
  beforeMount: function() {
    if (this.isLoggedInUser) {
      this.profile = this.currentProfile;
    } else {
      this.profile = this.getTutor(this.profileId);
    }
  },
  methods: {
    bookTutorButton() {
      return this.profile.canBeTutor &&
      (this.profile.id === this.currentProfile.id);
    },
    closeEditor() {
      this.editorOpen = false;
    },
    edit() {
      this.editorOpen = true;
    },
  },
};
</script>

