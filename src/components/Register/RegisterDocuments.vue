<template>
<div class="row h-100">
  <div class="col h-100">
  </div>
  <div class="col h-100">
    <education :profileId="currentProfile.id"/>
    <documents :profileId="currentProfile.id"/>
    <div class="row">
      <button type="button" class="col btn btn-primary mt-3" v-on:click="goNext">Done woot woot</button>
    </div>
  </div>
</div>
</template>

<script>
import {flowToNextStep, registerDocuments} from './RegisterFlow';
import {mapGetters} from 'vuex';
export default {
  name: 'RegisterDocuments',
  computed: {
    ...mapGetters('profile', ['currentProfile']),
  },
  methods: {
    async goNext() {
      await flowToNextStep({
        currentStep: registerDocuments,
        isTutor: this.currentProfile.isTutor,
        router: this.$router,
        params: {profileId: this.currentProfile.id},
      });
    },
  },
};
</script>

<style>

</style>
