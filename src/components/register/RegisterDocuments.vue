<template>
  <register-template
      :imageSrc="require('@/assets/pexels-karolina-grabowska-5908822.jpg')"
      :isLoading="isLoading"
      :error="error"
      :showError="showError"
    >
    <div id="register-documents">
      <education :profileId="currentProfile.id" :fetched-profile="currentProfile" class="mb-5"/>
      <resume :profileId="currentProfile.id" :fetched-profile="currentProfile" class="mb-5"/>
      <button
        type="button"
        id="next-button"
        class="w-100 primary-btn primary-btn-dark mt-3" v-on:click="goNext">
        Done woot woot
      </button>
    </div>
  </register-template>
</template>

<script>
import RegisterTemplate from './RegisterTemplate.vue';
import {flowToNextStep, registerDocuments} from './RegisterFlow';
import {mapGetters} from 'vuex';
import {ErrorMixin} from '@/components/mixins/';

export default {
  name: 'RegisterDocuments',
  components: {
    RegisterTemplate,
  },
  computed: {
    ...mapGetters('profile', ['currentProfile']),
  },
  data() {
    return {
      isLoading: false,
    };
  },
  mixins: [ErrorMixin],
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

<style scoped>
#register-documents{
  width:100%;
  height:100%;
  padding-left:3%;
  padding-right:3%;
  padding-top:6rem;
  padding-bottom: 3rem;
  overflow-y: scroll;
  overflow-x:hidden;
}

#next-button{
  height: 2.5rem;
}
</style>
