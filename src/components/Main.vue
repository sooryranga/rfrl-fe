<template>
  <div id="main">
    <main-nav-bar></main-nav-bar>
    <transition name="slide-fade">
      <div id="seperator" :style="{backgroundColor:seperatorColor($route.name)}"/>
    </transition>
    <div class="flex-item-grow col-flex-container">
      <div id="content" class="h-100 w-100 flex-item-grow">
        <transition name="fade" mode="out-in">
          <router-view :key="routerViewKey">
            <verify-email-banner
              slot="global-banner"
              v-if="emailBannerReqiured"
              :email-type="emailBannerType"
              />
          </router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import VerifyEmailBanner from './VerifyEmailBanner.vue';
import {Profile} from '@/api';
import MainNavBar from './MainNavBar.vue';

const WITH_SEPARATOR_MODAL_ROUTES = new Set([
  'home',
  'clients',
]);

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
    profileLink() {
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
    seperatorColor() {
      return WITH_SEPARATOR_MODAL_ROUTES.has(this.$route.name) ?(
          'var(--clr-primary-lighter)'
        ) : 'var(--clr-primary)';
    },
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

.col-flex-container{
  flex-direction: column;
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

@media (max-width: 653px) {
  .nav-links {
    display: none;
  }
  .drop-down-router-links {
    display: block;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s linear;
}


.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all .3s linear;
}
.slide-fade-leave-active {
  transition: all .3s linear;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(-10px);
  opacity: 0;
}
</style>
