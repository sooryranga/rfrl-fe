<template>
  <div id="main">
    <nav ref="nav" id="topbar" class="
      align-items-center p-1
      border-bottom shadow-sm
      text-center
    ">
      <div class="container-xl nav-container">
        <div class="logo">
          <router-link to="/" style="text-decoration:none; color: white;">TutorMe</router-link>
        </div>
        <div class="nav-links-with-profile">
          <div class="nav-links">
            <router-link to="/questions"
                v-slot="{href, navigate, isActive}"
            >
              <nav-link :navigate="navigate" v-bind:href="href" :active="isActive">
                Questions
              </nav-link>
            </router-link>
            <router-link to="/clients"
                v-slot="{href, navigate, isActive}"
            >
              <nav-link :navigate="navigate" v-bind:href="href" :active="isActive">
                Clients
              </nav-link>
            </router-link>
            <router-link to="/tutors"
                v-slot="{href, navigate, isActive}"
            >
              <nav-link :navigate="navigate" v-bind:href="href" :active="isActive">
                Tutor
              </nav-link>
            </router-link>
            <router-link to="/chat"
              v-slot="{href, navigate, isActive}"
            >
              <nav-link :navigate="navigate" v-bind:href="href" :active="isActive">
                Messages
              </nav-link>
            </router-link>
          </div>
          <div v-if="loggedIn" class="to-right">
            <div class="dropdown">
              <button class="btn btn-light dropdown-toggle"
                type="button" ref="profileDropdownRef"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown" aria-expanded="false">
                <img id="navProfilePicture" v-bind:src="currentProfile.photo"/>
                {{currentProfile.firstName}} {{currentProfile.lastName[0]}}
              </button>
              <div class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton1">
                <div class="drop-down-router-links">
                  <router-link class="dropdown-item" to="/questions">Question</router-link>
                  <router-link
                    v-if="currentProfile.isTutor"
                    class="dropdown-item" to="/clients">
                    Clients
                  </router-link>
                  <router-link
                    v-if="currentProfile.isLookingForReferral"
                    class="dropdown-item" to="/tutors">
                    Tutor
                  </router-link>
                  <router-link class="dropdown-item" to="/chat">Messages</router-link>
                  <div class="dropdown-divider"></div>
                </div>
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
          <div class="align-items-center to-right" v-else>
            <router-link class="btn btn-light mr-2" to="/signup">Sign Up</router-link>
          </div>
        </div>
      </div>
    </nav>
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
import {Dropdown} from 'bootstrap';
import {mapGetters, mapActions} from 'vuex';
import VerifyEmailBanner from './VerifyEmailBanner.vue';
import {Profile} from '@/api';
import NavLink from '@/components/NavLink.vue';

export default {
  components: {VerifyEmailBanner, NavLink},
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
    ...mapActions('profile', ['loginAuthorized', 'logout']),
    async logoutUser() {
      await this.logout();
      this.$router.push({name: 'home'});
    },
  },
  async mounted() {
    await this.loginAuthorized();
    new Dropdown(this.$refs.profileDropdownRef);
  },
};
</script>

<style>
#topbar{
  background-color: var(--clr-primary-dark);
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 5vh;
    margin: 0 auto;
}

.nav-links-with-profile {
    display: flex;
    justify-content: space-between;
    flex: 1;
    max-width: 40rem;
    vertical-align: middle;
}

.nav-links {
  display: flex;
  justify-content: space-between;
  width: 60%;
  vertical-align: middle;
}

.primary-color{
  color: var(--clr-primary)
}

.logo {
  color: rgb(0, 0, 0);
  text-transform: uppercase;
  letter-spacing: 5px;
  font-size: 20px;
  width: 30%;
  font-weight: 600;
}

.to-right{
  margin-left: auto;
}

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

.drop-down-router-links {
  display: none;
}

@media only screen and (max-width: 653px) {
  .nav-links {
    display: none;
  }
  .drop-down-router-links {
    display: block;
  }
}
</style>
