<template>
<div class="row h-100">
  <div class="col h-100">
    <button type="button" class="btn btn-outline-dark btn-lg" v-on:click="setTutor">
      Looking to tutor
    </button>
  </div>
  <div class="col h-100">
    <button type="button" class="btn btn-outline-dark btn-lg" v-on:click="goToBasicInfo">
      Looking to learn
    </button>
  </div>
</div>
</template>

<script>
import {Auth} from '@/api';
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

      await this.goToBasicInfo();
    },
    async goToBasicInfo() {
      await Auth.AuthService.updateSignUpFlow({stage: 'BasicInfo'});
      this.$router.push({name: 'basicInfo'});
    },
  },
};
</script>

<style>

</style>
