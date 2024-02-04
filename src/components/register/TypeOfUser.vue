<template>
<div class="row h-100 w-100 p-0 m-0">
  <loading :active.sync="isLoading"/>
  <div class="col h-100 p-0">
    <img src="@/assets/pexels-djordje-petrovic-2102416.jpg" id="feature-img"/>
  </div>
  <div class="col h-100 p-0">
    <transition name="fade">
      <div v-if="showError" class="alert alert-danger fade-in fixed-current-top" role="alert">
        {{error}}
      </div>
    </transition>
    <div id="parent">
      <div class="referrer">
        <button class="primary-btn primary-btn-dark h-100 w-100" v-on:click="setTutor">
          Be a Refferer
        </button>
      </div>
      <div class="referrer">
        <button class="primary-btn primary-btn-dark h-100 w-100" v-on:click="goNext">
          Get Referred
        </button>
      </div>
    </div>
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

<style scoped>
.btn{
  width: 400px;
}

#parent{
  display: flex;
  justify-content: space-around;
  height: 100%;
  flex-direction:column;
  align-items: center;
  padding-top: 5rem;
  padding-bottom: 5rem;
}

#feature-img{
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.fixed-current-top {
  position: absolute;
  top: 1rem;
  width: calc(100% - 2rem);
  margin-left: 1rem;
  margin-right: 1rem;
  z-index: 123;
}

.referrer{
  flex: 0 0 10%;
  width: 50%;
  max-width: 30rem;
  height: 30%;
  max-height: 30rem;
  font-size: 1.5rem;
}
</style>
