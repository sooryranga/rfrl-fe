<template>
  <register-template
    :imageSrc="require('@/assets/pexels-djordje-petrovic-2102416.jpg')"
    :isLoading="isLoading"
    :error="error"
    :showError="showError"
  >
    <div class="parent">
      <div class="form-group">
        <label for="firstName">First Name</label>
        <div class="form-row">
          <div class="col">
            <input
              type="text" class="form-control" id="firstName" placeholder="First Name"
              :class="{ 'is-invalid': $v.firstName.$error }"
              v-model.trim="$v.firstName.$model"/>
          </div>
        </div>
        <div class="error row" v-if="$v.firstName.$error && !$v.firstName.required">
          <div class="col text-danger">
            <small>First Name is required</small>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="lastName">Last Name</label>
        <div class="form-row">
          <div class="col">
            <input
              type="text" class="form-control" id="lastName" placeholder="Last Name"
              :class="{ 'is-invalid': $v.lastName.$error }"
              v-model.trim="$v.lastName.$model"/>
          </div>
        </div>
        <div class="error row" v-if="$v.lastName.$error && !$v.lastName.required">
          <div class="col text-danger">
            <small>Last Name is required</small>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="about">Describe Yourself</label>
        <div class="form-row">
          <div class="col">
            <textarea
              v-model="about"
              class="form-control"
              rows="3" id="about" placeholder="About"
            />
          </div>
        </div>
      </div>
      <button
        type="button"
        id="next-button"
        class="primary-btn primary-btn-dark mt-5 w-100" v-on:click="saveAndNext">
        Lets Go!
      </button>
    </div>
  </register-template>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {required, minLength} from 'vuelidate/lib/validators';
import {flowToNextStep, basicInfo} from './RegisterFlow';
import RegisterTemplate from './RegisterTemplate.vue';
import {ErrorMixin} from '@/components/mixins';

export default {
  components: {RegisterTemplate},
  name: 'BasicUserInfo',
  validations: {
    firstName: {
      required,
      minLength: minLength(2),
    },
    lastName: {
      required,
    },
  },
  mixins: [ErrorMixin],
  computed: {
    ...mapGetters('profile', ['currentProfile']),
  },
  data() {
    return {
      about: '',
      firstName: '',
      lastName: '',
      isLoading: false,
    };
  },
  methods: {
    ...mapActions('profile', ['updateProfile']),
    async saveAndNext() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.isLoading = true;
      try {
        await this.updateProfile({
          firstName: this.firstName,
          lastName: this.lastName,
          about: this.about.length > 0 ? this.about : null,
        });
        await this.goNext();
      } catch (error) {
        this.setError(error?.message);
      }
      this.isLoading = false;
    },
    async goNext() {
      await flowToNextStep({
        currentStep: basicInfo,
        isTutor: this.currentProfile.isTutor,
        router: this.$router,
        params: {profileId: this.currentProfile.id},
      });
    },
  },
  mounted() {
    this.about = this.currentProfile?.about;
    this.firstName = this.currentProfile?.firstName;
    this.lastName = this.currentProfile?.lastName;
  },
};
</script>

<style scoped>
.parent{
  max-width: 30rem;
  width: 90%;
}
.form-group{
  padding-top: 1rem;
}
#next-button{
  height:2.5rem;
}
</style>
