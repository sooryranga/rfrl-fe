<template>
  <div v-if="isLoggedInUser" class="shadow p-3 my-4 pt-5 pb-4 bg-white">
    <about-editor
      v-if="editorOpen"
      v-on:saveEvent="saveEvent"
      v-on:cancelEvent="cancelEvent"
    ></about-editor>
    <div class="row">
      <div class="col-3">
        <img class="profilePicture" v-bind:src="profile.profileImage"/>
        <div v-if="bookTutorButton">
          <router-link class="btn btn-dark p-2 mr-2"  :to="bookTutorRoute">Book Tutor</router-link>
        </div>
      </div>
      <div class="col">
        <h4 class="">{{profile.name}}</h4>
        <h5 class=" text-uppercase"> About </h5>
        <p class="">{{profile.about}}</p>
      </div>
      <div class="col-2" v-if="isLoggedInUser">
        <span v-on:click="edit" class="material-icons md-dark btn-outline-light btn">create</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {NAME, PROFILE_PICTURE, ABOUT} from '@/constants.actions.js';
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
    'profileId': String,
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
    'isLoggedInUser': function() {
      return this.currentProfile.id == this.profileId;
    },
    'bookTutorRoute': function() {
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
      this.profile = this.currentProfile;
    }
  },
  methods: {
    ...mapActions('profile', [NAME, PROFILE_PICTURE, ABOUT]),
    'bookTutorButton': function() {
      return this.profile.isTutor &&
      (this.profile.id === this.currentProfile.id);
    },
    'cancelEvent': function() {
      this.editorOpen = false;
    },
    'edit': function() {
      this.editorOpen = true;
    },
    'saveEvent': function(state) {
      if (state.name) {
        this[NAME](state.name);
      }

      if (state.about) {
        this[ABOUT](state.about);
      }
      this.editorOpen = false;
    },
  },
};
</script>

