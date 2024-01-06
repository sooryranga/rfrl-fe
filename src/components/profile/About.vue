<template>
  <div class="shadow p-3 my-4 pt-5 pb-4 bg-white">
    <loading :active.sync="isLoading"/>
    <div v-if="!isLoading">
      <about-editor
        v-if="aboutEditorOpen"
        v-on:closeEditor="closeAboutEditor"
      />
      <photo-editor
        v-if="photoEditorOpen"
        v-on:closeEditor="closePhotoEditor"
      />
      <div class="row">
        <div class="col-3">
          <img class="profilePicture" v-bind:src="profile.photo" v-on:click="updateImage"/>
          <div v-if="bookTutorButton">
            <router-link class="btn btn-dark p-2 mr-2"  :to="bookTutorRoute">Book Tutor</router-link>
          </div>
        </div>
        <div class="col">
          <h4 class="">{{profile.firstName}} {{profile.lastName}}</h4>
          <p class="">{{profile.about}}</p>
          <p>{{profile.workTitle}} - {{profile.yearsOfExperience}}</p>
          <p><i class="fab fa-linkedin"></i> {{profile.linkedInProfile}}</p>
          <p><i class="fab fa-github"></i> {{profile.githubProfile}}</p>
        </div>
        <div class="col-2" v-if="isLoggedInUser">
          <span v-on:click="edit" class="material-icons md-dark btn-outline-light btn">create</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {Client} from '@/api';
import AboutEditor from '@/components/profile/AboutEditor.vue';
import PhotoEditor from '@/components/profile/PhotoEditor.vue';
import {profileState} from '@/constants.state.js';

export default {
  name: 'about',
  components: {
    'about-editor': AboutEditor,
    'photo-editor': PhotoEditor,
  },
  data: function() {
    return {
      aboutEditorOpen: false,
      photoEditorOpen: false,
      otherProfile: profileState(),
    };
  },
  props: {
    profileId: String,
    fetchedProfile: Object,
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
    isLoggedInUser() {
      return this.currentProfile.id === this.profileId;
    },
    bookTutorRoute() {
      return {
        name: 'profile-calendar',
        params: {userId: this.profile.id},
      };
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
    bookTutorButton() {
      return this.profile.canBeTutor &&
      (this.profile.id != this.currentProfile.id);
    },
  },
  async mounted() {
    if (!this.isLoggedInUser) {
      if (this.fetchedProfile) {
        this.otherProfile = this.fetchedProfile;
      } else {
        this.otherProfile = await Client.ClientService.get(this.profileId);
      }
    }
  },
  methods: {
    closeAboutEditor() {
      this.aboutEditorOpen = false;
    },
    edit() {
      this.aboutEditorOpen = true;
    },
    updateImage() {
      this.photoEditorOpen = true;
    },
    closePhotoEditor() {
      this.photoEditorOpen = false;
    },
  },
};
</script>

