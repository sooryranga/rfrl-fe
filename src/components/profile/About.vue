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
          <img id="profile-picture" v-bind:src="profile.photo" v-on:click="updateImage"/>
          <router-link
          class="btn btn-dark p-2"
          id="book-tutor-btn"
          v-if="!isLoggedInUser"
          :to="bookTutorRoute">Book Tutor</router-link>
        </div>
        <div class="col">
          <h1 class="primary-color">{{profile.firstName}}</h1>
          <div class="current-work">
            <p v-if="profile.workTitle">
              {{profile.workTitle}} <span v-if="profile.yearsOfExperience"> - {{profile.yearsOfExperience}} yrs </span>
            </p>
            <p v-if="profile.verifiedWorkEmail && profile.companyId">
              {{getCompanyName(profile.companyId)}}
              <span class="material-icons check-mark">
                check_circle
              </span>
            </p>
            <p v-else>
              Not Verified
            </p>
          </div>
          <div class="external-profiles">
            <p><a v-if="profile.linkedInProfile" :href="toLinkedIn(profile.linkedInProfile)">
              <i class="fab fa-linkedin"></i> {{profile.linkedInProfile}}
            </a></p>
            <p><a v-if="profile.githubProfile" :href="toGithub(profile.githubProfile)">
              <i class="fab fa-github"></i> {{profile.githubProfile}}
            </a></p>
          </div>
          <p id="about">{{profile.about}}</p>
        </div>
        <div class="col-2" v-if="isLoggedInUser">
          <button class="no-styling-button"><span
            v-on:click="edit"
            id="edit-about"
            class="primary-color material-icons">
            create
          </span></button>
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
    ...mapGetters('companies', ['companies']),
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
    toLinkedIn(shortenedLinkedIn) {
      return 'https://www.linkedin.com/' + shortenedLinkedIn;
    },
    toGithub(shortenedGithub) {
      return 'https://' + shortenedGithub;
    },
    getCompanyName(companyId) {
      if (companyId in this.companies) {
        return this.companies[companyId]?.name;
      }
      return '';
    },
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

<style scoped>
#edit-about{
  margin-left: auto;
  margin-right: auto;
  color: var(--clr-primary-lighter)
}

#edit-about:hover{
  color: var(--clr-primary-darkest)
}

#profile-picture{
  width: 70%;
  min-width: 5rem;
  clip-path: circle(40% at center);
  display: block;
  margin-left: auto;
  margin-right: auto;
}

#book-tutor-btn{
  display: block;
}

p {
  margin-bottom: 0;
}

.external-profiles{
  margin-top: 0.5rem;
  font-size: 0.8rem;
  line-height: 1.6;
}

.current-work {
  font-size: 0.9rem;
  letter-spacing: 1px;
}

.current-work p {
  color: var(--clr-gray-1)
}

.check-mark {
  display:inline-flex;
  vertical-align:top;
  color: var(--clr-success);
}

#about{
  margin-top: 1rem;
}
</style>
