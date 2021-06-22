<template>
  <div id="main">
    <main-nav-bar></main-nav-bar>
    <div id="seperator"></div>
    <div class="flex-item-grow">
      <verify-email-banner
        v-if="emailBannerReqiured"
        :email-type="emailBannerType"
        class="flex-item-shrink"/>
      <div id="content" class="h-100 w-100 flex-item-grow">
        <transition name="fade" mode="out-in">
          <router-view :key="routerViewKey"/>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import VerifyEmailBanner from './VerifyEmailBanner.vue';
import {Profile} from '@/api';
import MainNavBar from './MainNavBar.vue';

export default {
  components: {VerifyEmailBanner, MainNavBar},
  name: 'tutor',
  data() {
    return {
      profileDropdown: null,
    };
  },
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
    ...mapActions('profile', ['loginAuthorized']),
  },
  async mounted() {
    await this.loginAuthorized();
  },
};
</script>

<style>
#main{
  flex-direction: row;
  display:flex;
  height:100%;
  flex-wrap: nowrap;
}
.flex-item-grow{
  flex: 1;
  min-width: 0; /* new */
}

.drop-down-router-links {
  display: none;
}

#seperator{
  height:100%;
  width: 0.5rem;
  background: var(--clr-primary-lighter);
}

@media only screen and (max-width: 653px) {
  .nav-links {
    display: none;
  }
  .drop-down-router-links {
    display: block;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}


.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
