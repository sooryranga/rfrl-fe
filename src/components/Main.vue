<template>
  <div id="main">
    <div class="
      align-items-center p-1 px-md-4
      bg-white border-bottom shadow-sm
      text-center
    " id="topnavbar">
      <div class="container-xl" id="navbar2">
        <div class="row my-2">
          <div class="col-4">
            <div class="row">
              <router-link class="p-2 col" to="/">TutorMe</router-link>
            </div>
          </div>
          <div class="col">
            <div class="row">
              <router-link class="col p-2 text-dark" to="/questions">Ask Question</router-link>
              <router-link
                v-if="currentProfile.isTutor"
                class="col p-2 text-dark" to="/clients">
                Find Clients
              </router-link>
              <router-link
                v-if="currentProfile.isLookingForReferral"
                class="col p-2 text-dark" to="/tutors">
                Find Tutor
              </router-link>
              <router-link class="col p-2 text-dark" to="/chat">Messages</router-link>
              <div v-if="loggedIn" class="col">
                <div class="dropdown">
                  <button
                  class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img id="navProfilePicture" v-bind:src="currentProfile.photo"/>
                    {{currentProfile.firstName}} {{currentProfile.lastName}}
                  </button>
                  <div class="dropdown-menu dropdown-menu-left" aria-labelledby="dropdownMenuButton">
                    <router-link
                        class="dropdown-item text-dark"
                        :to="profileLink">
                      View Profile
                    </router-link>
                    <a class="dropdown-item" href="#">Settings & Privacy</a>
                    <a class="dropdown-item" v-on:click="logoutUser" href="#">Log Out</a>
                  </div>
                </div>
              </div>
              <div class="col align-items-center" v-else>
                <router-link class="btn btn-dark mr-2" to="/signup">Sign Up</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <verify-email-banner
      v-if="emailBannerReqiured"
      :email-type="emailBannerType"
      class="flex-item-shrink"/>
    <div id="content" class="w-100 flex-item-grow">
      <router-view :key="routerViewKey"/>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import VerifyEmailBanner from './VerifyEmailBanner.vue';
import {Profile} from '@/api';

export default {
  components: {VerifyEmailBanner},
  name: 'tutor',
  computed: {
    ...mapGetters('profile', ['currentProfile', 'loggedIn', 'logInType']),
    profileLink: function() {
      return {
        name: 'profile',
        params: {userId: this.currentProfile.id},
      };
    },
    routerViewKey() {
      return this.$route.fullPath.split('/').slice(0, 2).join('/');
    },
    emailBannerReqiured() {
      return (
        (
          !this.currentProfile.verifiedEmail &&
          this.currentProfile?.email
        ) ||
        (
          !this.currentProfile.verifiedWorkEmail &&
          this.currentProfile.isTutor
        )
      ) && this.$route.name !== 'verify-email';
    },
    emailBannerType() {
      if (!this.emailBannerReqiured) return '';
      if (!this.currentProfile?.verifiedEmail && this.currentProfile?.email) {
        return Profile.USER_EMAIL;
      }
      return Profile.WORK_EMAIL;
    },
  },
  methods: {
    ...mapActions('profile', ['loginAuthorized', 'logout']),
    async logoutUser() {
      await this.logout();
      this.$router.push({name: 'home'});
    },
  },
  async mounted() {
    await this.loginAuthorized();
  },
};
</script>

<style>
.sticky-top{
  z-index:4
}
#navProfilePicture{
  width: 2rem;
  background-size: cover;
  background-position: top center;
  border-radius: 50%;
}
#main{
  flex-direction: column;
  display:flex;
  height:100%;
  flex-wrap: nowrap;
}
.flex-item-grow{
  flex: 1;
  min-height: 0; /* new */
}
</style>
