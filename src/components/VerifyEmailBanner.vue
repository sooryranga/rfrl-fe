<template>
  <div class="alert alert-warning m-0 p-1" id="notification">
    <div id="container">
      <div v-if="isUserEmail" class="float-left pl-3">
        <strong>Verify your email!</strong> You need to verify your email.
      </div>
      <div v-else class="float-left pl-3">
        <strong>Where do you work?</strong> associate your work email to get more views.
      </div>
      <div id="verify-button">
        <button v-on:click="verify" class="btn btn-warning btn-sm">Verify</button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {Profile} from '@/api';

export default {
  name: 'verify-email-banner',
  data: function() {
    return {
      isUserEmail: this.emailType === Profile.USER_EMAIL,
    };
  },
  props: {
    emailType: {
      type: String,
      default: Profile.USER_EMAIL,
    },
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
  },
  methods: {
    verify() {
      this.$router.push({
        name: 'verify-email',
        params: {
          emailType: this.emailType,
          email: this.isUserEmail? this.currentProfile.email: '',
        },
      });
    },
  },
};
</script>

<style scoped>
#container{
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
}

#verify-button{
  margin-left: 4rem;
}
</style>
