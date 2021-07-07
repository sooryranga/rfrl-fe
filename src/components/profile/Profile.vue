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
        <slot name="global-banner"/>
        <profile-about :profile-id="userId" :fetched-profile="profile"/>
        <want-referral class="profile-component" v-if="isLoggedInUser"/>
        <education class="profile-component" :profile-id="userId" :fetched-profile="profile"/>
        <resume class="profile-component" :profile-id="userId"/>
        <tutor-review class="profile-component" :profile-id="userId"/>
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
  name: 'profile-component',
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
.profile-component{
  padding-top:1.5rem;
  padding-bottom:1.5rem;
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
  padding-left: 4rem;
  padding-right: 4rem;
  flex: 1 1 100%;
  overflow-y: scroll;
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
</style>
