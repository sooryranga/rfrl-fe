<template>
<div class="row h-100">
  <div class="col h-100">
  </div>
  <div class="col h-100">
    <education :profileId="currentProfile.id"/>
    <documents :profileId="currentProfile.id"/>
    <div class="row">
      <button type="button" class="col btn btn-primary mt-3" v-on:click="goToProfile">Done woot woot</button>
    </div>
  </div>
</div>
</template>

<script>
import {Auth} from '@/api';
import {mapGetters} from 'vuex';
export default {
  name: 'RegisterDocuments',
  computed: {
    ...mapGetters('profile', ['currentProfile']),
  },
  methods: {
    async goToProfile() {
      await Auth.AuthService.updateSignUpFlow({stage: 'DoneSignUp'});
      this.$router.push(
          {
            name: 'profile',
            params: {userId: this.currentProfile.id},
          },
      );
    },
  },
};
</script>

<style>

</style>
