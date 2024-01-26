<template>
  <div class="h-100">
    <loading :active.sync="isLoading"/>
    <div v-if="!isLoading" id="profile">
      <div id="side-bar">
        <scheduled-tutoring
          showName
          v-if="isLoggedInUser"
          :profile-id="userId"/>
        <asked-questions :profile-id="userId"></asked-questions>
      </div>
      <div id="profile-section">
        <profile-about :profile-id="userId" :fetched-profile="profile"></profile-about>
        <want-referral v-if="isLoggedInUser"></want-referral>
        <education :profile-id="userId" :fetched-profile="profile"></education>
        <documents :profile-id="userId"></documents>
        <tutor-review :profile-id="userId"></tutor-review>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {Client} from '@/api';
import AskedQuestions from '@/components/profile/AskedQuestions.vue';
import WantReferral from './WantReferral.vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  name: 'tutor',
  data: function() {
    return {
      profile: null,
    };
  },
  props: {
    userId: String,
  },
  components: {
    'asked-questions': AskedQuestions,
    WantReferral,
    Loading,
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
    isLoggedInUser() {
      return this.currentProfile.id === this.userId;
    },
    isLoading() {
      return this.profile === null;
    },
  },
  async mounted() {
    if (this.isLoggedInUser) {
      this.profile = this.currentProfile;
    } else {
      this.profile = await Client.ClientService.get(this.userId);
    }
  },
};
</script>

<style>
:root{
  --section-button-span-clr: var(--clr-primary-lighter);
  --section-button-span-hover-clr: var(--clr-primary-darkest);
}

#profile{
  flex-direction: row;
  display:flex;
  height:100%;
  flex-wrap: nowrap;
}

#side-bar{
  padding-left: 1rem;
  padding-right: 2rem;
  background-color: var(--clr-primary);
  color: white;
  font-size:1.1rem;
  padding-top: 2rem;
  flex: 0 0 380px;
}

#profile-section{
  padding-left: 1rem;
  padding-right: 1rem;
  flex: 1 1 100%;
  overflow-y: scroll;
}

.section-button-container{
  display: flex;
  align-items: center;
}
.section-button{
  font-size:1rem;
  line-height: 1rem;
}
.section-button-span{
  color: var(--section-button-span-clr)
}
.section-button-span:hover{
  color: var(--section-button-span-hover-clr)
}

.studentPicture{
  background-size: cover;
  background-position: top center;
  border-radius:50%;
  background-color: #fff;
  height: 5vh;
  width: 5vh;
}
.overflowContainer{
  overflow-y:scroll;
}
/* Rules for sizing the icon. */
.material-icons.md-18 { font-size: 18px; }
.material-icons.md-24 { font-size: 24px; }
.material-icons.md-36 { font-size: 36px; }
.material-icons.md-48 { font-size: 48px; }

/* Rules for using icons as black on a light background. */
.material-icons.md-dark { color: rgba(0, 0, 0, 0.54); }
.material-icons.md-dark.md-inactive { color: rgba(0, 0, 0, 0.26); }

/* Rules for using icons as white on a dark background. */
.material-icons.md-light { color: rgba(255, 255, 255, 1); }
.material-icons.md-light.md-inactive { color: rgba(255, 255, 255, 0.3); }
</style>
