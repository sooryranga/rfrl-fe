<template>
<div class="row h-100">
  <div class="col h-100">
    <!--Buy picture-->
  </div>
  <div class="col h-100">
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
          <small>First Namee is required</small>
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
      <label for="about">Describe your self</label>
      <div class="form-row">
        <div class="col">
          <textarea
            v-model="about"
            class="form-control"
            rows="3" id="about" placeholder="about"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <button type="button" class="col btn btn-primary mt-3" v-on:click="saveAndNext">Lets Goooo</button>
    </div>
  </div>
</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {Auth} from '@/api';
import {required, minLength} from 'vuelidate/lib/validators';

export default {
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
  computed: {
    ...mapGetters('profile', ['currentProfile']),
  },
  data() {
    return {
      about: '',
      firstName: '',
      lastName: '',
    };
  },
  methods: {
    ...mapActions('profile', ['updateProfile']),
    async saveAndNext() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      this.updateProfile({
        firstName: this.firstName,
        lastName: this.lastName,
        about: this.about.length > 0 ? this.about : null,
      });
      await this.goToRegisterDocuments();
    },
    async goToRegisterDocuments() {
      await Auth.AuthService.updateSignUpFlow({stage: 'RegisterDocuments'});

      this.$router.push(
          {
            name: 'registerDocuments',
          },
      );
    },
  },
  mounted() {
    this.about = this.currentProfile?.about;
    this.firstName = this.currentProfile?.firstName;
    this.lastName = this.currentProfile?.lastName;
  },
};
</script>

<style>

</style>
