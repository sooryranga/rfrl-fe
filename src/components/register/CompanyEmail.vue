<template>
  <register-template
    :imageSrc="require('@/assets/pexels-flo-dahm-699459.jpg')"
    :isLoading="isLoading"
    :error="error"
    :showError="showError"
  >
    <div id="company-email">
      <div id="explain-why-container">
        <p class="explain-why-company-email">
          You wanna tutor and recruit some good co-workers
          then you gotta tell them where you work!
          Referral bonus is on the line :P
        </p>
        <p class="explain-why-company-email">
          We will sent a passcode to your work email and
          you will need to submit the passcode back to us.
        </p>
        <p class="explain-why-company-email">
          Don't worry, your email is encrypted.
        </p>
      </div>
      <form v-if="!askForPasscode">
        <div class="form-group">
            <label for="exampleInputEmail1">Company Email address</label>
            <div class="form-row">
              <div class="col">
                <input
                  class="form-control" id="exampleInputEmail1"
                  :class="{ 'is-invalid': $v.email.$error }"
                  v-model.trim="$v.email.$model"
                  placeholder="Enter email"/>
              </div>
            </div>
            <div class="error row" v-if="$v.email.$error && !$v.email.required">
              <div class="col text-danger">
                <small>Email is required</small>
              </div>
            </div>
            <div class="error row" v-if="$v.email.$error && !$v.email.email">
              <div class="col text-danger">
                <small>Not a valid email.</small>
              </div>
            </div>
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
          <div class="row">
            <button
              type="button"
              class="col primary-btn primary-btn-dark mt-3 p-2"
              v-on:click="setCompanyVerification">
            Verify Company
            </button>
          </div>
          <div class="row">
            <button
              type="button"
              class="col primary-btn primary-btn-dark mt-3 p-2"
              v-on:click="skipCompanyVerification">
            Skip Verification
            </button>
          </div>
      </form>
      <form v-else>
        <div class="row">
          <div class="col">
            We sent a passcode to {{email}}. Check your inbox!
          </div>
        </div>
        <label for="passcodeInput">Passcode</label>
        <div class="form-row">
          <div class="col">
            <input
              class="form-control" id="passcodeInput"
              :class="{ 'is-invalid': invalidPasscode }"
              v-model.trim="passcode"
              @change="resetInvalidPasscode"
              placeholder="Enter passcode"/>
          </div>
        </div>
        <div class="error row" v-if="invalidPasscode">
          <div class="col text-danger">
            <small>Passcode is invalid. Check your email again!</small>
          </div>
        </div>
        <div class="row">
          <button
              type="button"
              class="col primary-btn primary-btn-dark mt-3 p-2"
              v-on:click="verifyPasscode">
          Verify
          </button>
        </div>
        <div class="row">
          <button
            type="button"
            class="col primary-btn primary-btn-dark mt-3 p-2"
            v-on:click="deleteEmailRelation">
          Change Email
          </button>
        </div>
        <div class="row">
          <button
            type="button"
            class="col primary-btn primary-btn-dark mt-3 p-2"
            v-on:click="skipCompanyVerification">
          Skip
          </button>
        </div>
      </form>
    </div>
  </register-template>
</template>

<script>
import RegisterTemplate from '@/components/register/RegisterTemplate.vue';
import {mapGetters, mapActions} from 'vuex';
import {flowToNextStep, companyEmail} from './RegisterFlow';
import {required, email} from 'vuelidate/lib/validators';
import {Profile} from '@/api';

export default {
  name: 'SignUp',
  validations: {
    email: {
      email,
      required,
    },
  },
  components: {
    RegisterTemplate,
  },
  data: function() {
    return {
      email: '',
      askForPasscode: false,
      passcode: null,
      invalidPasscode: false,
      loading: false,
      error: null,
    };
  },
  computed: {
    ...mapGetters('profile', ['currentProfile', 'loggedIn']),
  },
  watch: {
    async loggedIn(loggedIn) {
      if (!loggedIn && this.email === '') return;
      await this.getVerificationEmail();
    },
  },
  methods: {
    ...mapActions('profile', ['setEmailVerification']),
    async getVerificationEmail() {
      this.email = await Profile.ProfileService.getVerificationEmail({
        profileId: this.currentProfile.id,
        type: Profile.WORK_EMAIL,
      });
      this.askForPasscode = true;
    },
    async goNext() {
      await flowToNextStep({
        currentStep: companyEmail,
        isTutor: this.currentProfile.isTutor,
        router: this.$router,
        params: {profileId: this.currentProfile.id},
      });
    },
    resetInvalidPasscode() {
      this.invalidPasscode = false;
    },
    async skipCompanyVerification() {
      await this.goNext();
    },
    async setCompanyVerification() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      await Profile.ProfileService.addEmail({
        profileId: this.currentProfile.id,
        type: Profile.WORK_EMAIL,
        email: this.email,
      });
      this.askForPasscode = true;
    },
    async deleteEmailRelation() {
      await Profile.ProfileService.deleteEmailRelation({
        profileId: this.currentProfile.id,
        type: Profile.WORK_EMAIL,
      });
      this.passcode = null;
      this.askForPasscode = false;
    },
    async verifyPasscode() {
      if (this.passcode.length !== 6) {
        this.invalidPasscode = true;
      }
      try {
        const profile = await Profile.ProfileService.verifyEmailPasscode({
          profileId: this.currentProfile.id,
          type: Profile.WORK_EMAIL,
          email: this.email,
          passcode: this.passcode,
        });
        this.setEmailVerification(profile);
      } catch (err) {
        this.invalidPasscode = true;
        throw err;
      }
      await this.goNext();
    },
  },
  async mounted() {
    if (this.loggedIn) {
      await this.getVerificationEmail();
    }
  },
};
</script>

<style scoped>
.explain-why-company-email{
  text-align: center;
  font-size: 1.1rem;
  color: var(--clr-accent);
  font-weight: 400;
}

#explain-why-container{
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
}
</style>
