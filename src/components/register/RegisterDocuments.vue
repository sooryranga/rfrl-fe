<template>
  <register-template
      :imageSrc="require('@/assets/pexels-djordje-petrovic-2102416.jpg')"
      :isLoading="isLoading"
      :error="error"
      :showError="showError"
    >
    <div id="register-documents">
      <education :profileId="currentProfile.id" :fetched-profile="currentProfile"/>
      <resume :profileId="currentProfile.id" :fetched-profile="currentProfile"/>
      <div class="row">
        <button type="button" class="col btn btn-primary mt-3" v-on:click="goNext">Done woot woot</button>
      </div>
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
.section-button-container{
  display: flex;
  align-items: center;
}

.section-button{
  font-size:1rem;
  line-height: 1rem;
}

.section-button-span{
  color: var(--clr-primary-lighter)
}

.section-button-span:hover{
  color: var(--clr-primary-darkest)
}

#register-documents{
  width:100%;
  padding-left:3rem;
  padding-right:3rem;
  height:100%;
  padding-top:6rem;
  padding-bottom: 3rem;
  overflow-y: scroll;
}
</style>
