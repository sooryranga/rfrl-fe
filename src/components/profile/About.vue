<template>
  <div id="about-container">
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
      <div class="flex-container-column">
        <div id="left-container">
          <img id="profile-picture" v-bind:src="profile.photo" v-on:click="updateImage"/>
          <router-link
          class="primary-btn primary-btn-dark p-2 m-2"
          id="book-tutor-btn"
          v-if="!isLoggedInUser"
          :to="bookTutorRoute">Book Tutor</router-link>
        </div>
        <div id="right-container">
          <h1 id="name">{{profile.firstName}}</h1>
          <p id="description">{{profile.about}}</p>
          <div class="profile-items">
            <p class="profile-item">
              <work-icon class="profile-item-icon" :hoverExpand="false" :iconColor="iconColor"/>
              <span v-if="profile.verifiedWorkEmail && profile.companyId">{{getCompanyName(profile.companyId)}}
              <span v-if="profile.yearsOfExperience"> - {{profile.yearsOfExperience}} yrs </span>
              </span>
              <span v-else>
                Not Verified
              </span>
            </p>
            <p v-if="profile.linkedInProfile" class="profile-item">
              <linked-in-icon class="profile-item-icon" :hoverExpand="false" :iconColor="iconColor"/>
              <a :href="toLinkedIn(profile.linkedInProfile)">{{profile.linkedInProfile}}</a>
            </p>
            <p v-if="profile.githubProfile" class="profile-item">
              <github-icon class="profile-item-icon" :hoverExpand="false" :iconColor="iconColor"/>
              <a :href="toGithub(profile.githubProfile)">{{profile.githubProfile}}</a>
            </p>
          </div>
        </div>
        <div v-if="isLoggedInUser">
          <button class="no-styling-button primary-color" id="edit-about" v-on:click="edit">
            <edit-icon :iconColor="'var(--clr-accent)'">
            </edit-icon>
          </button>
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
import {EditIcon} from '@/components/icons';
import {GithubIcon, WorkIcon, LinkedInIcon} from '@/components/icons';

export default {
  name: 'about',
  components: {
    'about-editor': AboutEditor,
    'photo-editor': PhotoEditor,
    EditIcon,
    GithubIcon,
    WorkIcon,
    LinkedInIcon,
  },
  data: function() {
    return {
      aboutEditorOpen: false,
      photoEditorOpen: false,
      otherProfile: profileState(),
      iconColor: 'var(--clr-gray-3)',
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
.flex-container-column{
  flex-direction: row;
  display:flex;
  flex-wrap: nowrap;
}

#about-container{
  padding-top:3rem;
  padding-bottom:3rem;
}

#name{
  color:var(--clr-primary);
  font-weight: 400;
  padding-bottom: 0.5rem;
  margin-bottom: 0;
  font-size: 4rem;
}

#left-container{
  flex: 0 0 15rem;
}

#right-container{
  flex: 1 1;
}

.profile-items{
  font-size: 1rem;
  line-height: 1.6;
}

.profile-item{
  margin-top:5px;
  color: var(--clr-gray-4);
}

.profile-item a {
  color: var(--clr-gray-4);
}


.profile-item a:hover {
  color: var(--clr-gray-2);
}

.profile-item-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

#edit-about{
  margin-left: auto;
  margin-right: auto;
  color: var(--clr-primary-lighter);
  font-size: 2rem;
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

.check-mark {
  display:inline-flex;
  vertical-align:top;
  color: var(--clr-success);
}

#description{
  padding-bottom: 0.5rem;
  font-weight: 300;
}

#title{
  color: var(--clr-primary);
  font-size: 2rem;
  font-weight: 400;
}
</style>
