<template>
  <register-template
    :imageSrc="require('@/assets/pexels-thisisengineering-3861964.jpg')"
    :isLoading="isLoading"
    :error="error"
    :showError="showError"
  >
    <button class="ref-btn" v-on:click="setTutor">
      Be a Refferer
    </button>
    <button class="ref-btn" v-on:click="goNext">
      Get Referred
    </button>
  </register-template>
</template>

<script>
import {ErrorMixin} from '@/components/mixins/';
import RegisterTemplate from './RegisterTemplate.vue';
import {flowToNextStep, typeOfUser} from './RegisterFlow';
import {mapActions, mapGetters} from 'vuex';

export default {
  name: 'TypeOfUser',
  components: {
    RegisterTemplate,
  },
  mixins: [ErrorMixin],
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
  },
  methods: {
    ...mapActions('profile', ['updateProfile']),
    async setTutor() {
      this.isLoading = true;

      try {
        await this.updateProfile(
            {isTutor: true},
        );
        await this.goNext();
      } catch (error) {
        this.setError(error?.message);
      }
      this.isLoading = false;
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
.ref-btn{
  width: 100%;
  height: 50%;
  font-size: 2rem;
  border-radius: 0rem;
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  color: var(--clr-accent);
  background-color: var(--clr-gray-9);
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border: 0;
  transition: all 0.1s linear;
}

.ref-btn:hover{
  color: white;
  border: none;
  background-color: var(--clr-accent);
}
</style>
