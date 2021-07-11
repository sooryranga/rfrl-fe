<template>
  <div class="row h-100">
    <div class="col h-100">
    </div>
    <div class="col h-100">
      <div>
        <pre v-if = "isWorkEmailVerification">
          You wanna tutor and recruit some good co-workers
          then you gotta tell them where you work!
          Referral bonus is on the line :P

          We will sent a passcode to your work email and
          you will need to submit the passcode back to us.

          Don't worry, your email is encrypted.
        </pre>
        <pre v-else>
          We verify emails before allowing users to schedule meetings
          This is done for security reasons.
        </pre>
      </div>
      <form v-if="!askForPasscode">
        <div class="form-group">
            <label for="exampleInputEmail1">Email address</label>
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
              class="col btn btn-primary mt-3"
              v-on:click="skipCompanyVerification">
            Go back
            </button>
          </div>
          <div class="row">
            <button
              type="button"
              class="col btn btn-primary mt-3"
              v-on:click="setCompanyVerification">
            Verify Company
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
            class="col btn btn-primary mt-3"
            v-on:click="verifyPasscode">
          Verify
          </button>
        </div>
        <div v-if="isWorkEmailVerification" class="row">
          <button
            type="button"
            class="col btn btn-primary mt-3"
            v-on:click="deleteEmailRelation">
          Change Email
          </button>
        </div>
        <div class="row">
          <button
            type="button"
            class="col btn btn-primary mt-3"
            v-on:click="skipCompanyVerification">
          Go Back
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {required, email} from 'vuelidate/lib/validators';
import {Profile} from '@/api';

export default {
  name: 'verify-email',
  validations: {
    email: {
      email,
      required,
    },
  },
  props: {
    emailType: {
      type: String,
      default: Profile.USER_EMAIL,
    },
  },
  data: function() {
    return {
      email: '',
      askForPasscode: false,
      passcode: null,
      invalidPasscode: false,
      loading: false,
      error: null,

      isWorkEmailVerification: false,
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
    goBack() {
      this.$router.go(-1);
    },
    resetInvalidPasscode() {
      this.invalidPasscode = false;
    },
    async skipCompanyVerification() {
      await this.goBack();
    },
    async setCompanyVerification() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      await Profile.ProfileService.addEmail({
        profileId: this.currentProfile.id,
        type: this.emailType,
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
          type: this.emailType,
          email: this.email,
          passcode: this.passcode,
        });
        this.setEmailVerification(profile);
      } catch (err) {
        this.invalidPasscode = true;
        throw err;
      }
      await this.goBack();
    },
  },
  async mounted() {
    this.isWorkEmailVerification = this.emailType === Profile.WORK_EMAIL;

    if (this.emailType === Profile.USER_EMAIL) {
      this.email = this.currentProfile.email;
      await this.setCompanyVerification();
    } else if (this.emailType === Profile.WORK_EMAIL) {
      await this.getVerificationEmail();
    }
  },
};
</script>
