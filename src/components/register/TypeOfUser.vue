<template>
<div class="row h-100">
  <div class="col h-100">
    <button type="button" class="btn btn-outline-dark btn-lg" v-on:click="setTutor">
      Looking to tutor
    </button>
  </div>
  <div class="col h-100">
    <button type="button" class="btn btn-outline-dark btn-lg" v-on:click="goNext">
      Looking to learn
    </button>
  </div>
</div>
</template>

<script>
import {flowToNextStep, typeOfUser} from './RegisterFlow';
import {mapActions, mapGetters} from 'vuex';

export default {
  name: 'TypeOfUser',
  computed: {
    ...mapGetters('profile', ['currentProfile']),
  },
  methods: {
    ...mapActions('profile', ['updateProfile']),
    async setTutor() {
      await this.updateProfile(
          {isTutor: true},
      );

      await this.goNext();
    },
    async goNext() {
      await flowToNextStep({
        currentStep: typeOfUser,
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
