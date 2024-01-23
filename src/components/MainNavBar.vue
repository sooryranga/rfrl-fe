<template>
  <div id="nav-bar">
    <div id="top-nav-bar">
      <router-link to="/home" style="text-decoration:none">
        <p id="logo-text">rfrl</p>
      </router-link>
      <router-link :to="profileLink" v-slot="{href, navigate, isActive}">
        <a v-bind:href="href" @click="navigate">
          <img
            id="nav-profile-picture"
            v-bind:src="currentProfile.photo"
            v-bind:style="{borderColor: activeColor(isActive)}"
          />
        </a>
      </router-link>
      <div id="nav-icon-links">
        <router-link to="/questions" class="icon-link"
            v-slot="{href, navigate, isActive}"
        >
          <nav-icon-link :navigate="navigate" v-bind:href="href">
            <question-icon :iconColor="activeColor(isActive)"></question-icon>
          </nav-icon-link>
        </router-link>
        <router-link to="/clients" class="icon-link"
            v-slot="{href, navigate, isActive}"
        >
          <nav-icon-link :navigate="navigate" v-bind:href="href">
            <client-icon :iconColor="activeColor(isActive)"></client-icon>
          </nav-icon-link>
        </router-link>
        <router-link to="/tutors" class="icon-link"
            v-slot="{href, navigate, isActive}"
        >
          <nav-icon-link :navigate="navigate" v-bind:href="href">
            <tutor-icon :iconColor="activeColor(isActive)"></tutor-icon>
          </nav-icon-link>
        </router-link>
        <router-link to="/chat" class="icon-link"
          v-slot="{href, navigate, isActive}"
        >
          <nav-icon-link :navigate="navigate" v-bind:href="href">
            <message-icon :iconColor="activeColor(isActive)"></message-icon>
          </nav-icon-link>
        </router-link>
      </div>
    </div>
    <div id="bottom-nav-bar">
      <div id="nav-icon-links">
        <router-link to="/settings" class="icon-link"
          v-slot="{href, navigate, isActive}"
        >
          <nav-icon-link :navigate="navigate" v-bind:href="href">
            <settings-icon :iconColor="activeColor(isActive)"></settings-icon>
          </nav-icon-link>
        </router-link>
        <button class="btn-no-style icon-link" v-on:click="logoutUser">
          <sign-out-icon :iconColor="activeColor(false)"></sign-out-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NavIconLink from '@/components/NavIconLink.vue';
import {mapGetters, mapActions} from 'vuex';
import {
  TutorIcon,
  QuestionIcon,
  ClientIcon,
  MessageIcon,
  SettingsIcon,
  SignOutIcon,
} from '@/components/icons/';

export default {
  components: {
    NavIconLink,
    TutorIcon,
    QuestionIcon,
    ClientIcon,
    MessageIcon,
    SettingsIcon,
    SignOutIcon,
  },
  computed: {
    ...mapGetters('profile', ['currentProfile', 'loggedIn', 'logInType']),
    profileLink: function() {
      return {
        name: 'profile',
        params: {userId: this.currentProfile.id},
      };
    },
  },
  methods: {
    ...mapActions('profile', ['loginAuthorized', 'logout']),
    async logoutUser() {
      await this.logout();
      this.$router.push({name: 'signup'});
    },
    activeColor(isActive) {
      return isActive ? 'var(--clr-accent)': 'var(--clr-primary)';
    },
  },
};
</script>

<style scoped>
#nav-bar{
  height: 100%;
  width: 4rem;
  flex-direction:column;
  flex-wrap: nowrap;
  justify-content:space-between;
  padding-top:1rem;
  padding-bottom:1rem;
  align-items: center;
  display: flex;
}

#logo-text{
  text-align: center;
  font-size: 2.1rem;
  color: var(--clr-primary)
}

#top-nav-bar{
  flex: 1 1
}

#bottom-nav-bar{
  flex: 0 1
}

#nav-profile-picture{
  width: 2.6rem;
  background-size: cover;
  background-position: top center;
  border-radius: 50%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  border: 3px solid var(--clr-primary);
}

#nav-icon-links{
  flex-direction:column;
  flex-wrap: nowrap;
  justify-content:space-between;
  padding-top:1rem;
  padding-bottom:1rem;
  align-items: center;
  display: flex;
}

.icon-link{
  max-height: 10%;
  height: 4rem;
  font-size:  2.5rem;
}

.btn-no-style{
  background: none;
  color: inherit;
  border: none;
  cursor: pointer;
  outline: inherit;
}
</style>
