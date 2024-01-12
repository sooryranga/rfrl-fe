<template>
<div class="row h-100">
  <div class="col">
     <div class="parent">
      <div class="mx-auto my-auto">
        <h1> Education </h1>
      </div>
     </div>
  </div>
  <div class="col">
    <div class="parent">
      <div class="mx-auto my-auto">
        <div id="google-signin-btn">
          <button type="button" class="btn btn-outline-dark btn-lg" v-on:click="loginToGoogle">
            <i class="fab fa-google"></i>
            Register with Google
          </button>
        </div>
        <div id="linkedin-signin-btn" class="mt-2">
          <button type="button" class="btn btn-outline-dark btn-lg" v-on:click="loginToLinkedIn">
            <i class="fab fa-linkedin"></i>
            Register with LinkedIn
          </button>
        </div>
        <hr class="mt-4 mb-4"/>
        <form>
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
          <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <div class="form-row">
              <div class="col">
                <input
                  type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"
                  :class="{ 'is-invalid': $v.password.$error }"
                  v-model.trim="$v.password.$model"/>
              </div>
            </div>
            <div class="error row" v-if="$v.password.$error && !$v.password.required">
              <div class="col text-danger">
                <small>Password is required</small>
              </div>
            </div>
            <div class="error row" v-if="$v.password.$error && !$v.password.minLength">
              <div class="col text-danger">
                <small>Password must have at least {{$v.password.$params.minLength.min}} characters.</small>
              </div>
            </div>
          </div>
          <div class="row">
            <button type="button" class="col btn btn-primary mt-3" v-on:click="registerWithEmail">Register</button>
          </div>
          <div class="row">
            <button type="button" class="col btn btn-primary mt-3" v-on:click="loginToEmail">Login</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import queryString from 'query-string';

import {flowToStep} from './RegisterFlow';
import {required, minLength, email} from 'vuelidate/lib/validators';


export default {
  name: 'SignUp',
  validations: {
    email: {
      email,
      required,
    },
    password: {
      required,
      minLength: minLength(6),
    },
  },
  data: function() {
    return {
      publicPath: process.env.BASE_URL,
      user: null,
      googleOauth: null,
      password: '',
      email: '',
    };
  },
  methods: {
    ...mapActions('profile', [
      'googleLogin',
      'linkedinLogin',
      'emailLogin',
      'emailRegister',
    ]),
    loginToLinkedIn: function() {
      const url = 'https://www.linkedin.com/oauth/v2/authorization?' +
      queryString.stringify(
          {
            response_type: 'code',
            client_id: '780irx50xypror',
            redirect_uri: 'http://localhost:8080/signup/',
            scope: ['r_liteprofile', 'r_emailaddress'],
          },
      );
      window.location.replace(url);
    },

    loginToGoogle() {
      this.googleOauth.signIn();
    },

    routeAfterLogin(auth) {
      flowToStep({
        currentStep: auth.signUpStage,
        isTutor: this.currentProfile.isTutor,
        router: this.$router,
        params: {profileId: this.currentProfile.id},
      });
    },

    async registerWithEmail() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      const auth = await this.emailRegister({
        email: this.email,
        password: this.password,
      });
      this.routeAfterLogin(auth);
    },
    async loginToEmail() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      const auth = await this.emailLogin({
        email: this.email,
        password: this.password,
      });
      this.routeAfterLogin(auth);
    },
    async onGoogleSignIn(hasUser) {
      if (!hasUser) {
        console.log('Need to reauth');
        return;
      }
      const googleUser = this.googleOauth.currentUser.get();
      const profile = googleUser.getBasicProfile();
      const idToken = profile.getId();
      console.log('ID: ' + profile.getId());
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());
      console.log('token: ' + idToken);

      const auth = await this.googleLogin({
        token: idToken,
        name: profile.getName(),
        profilePicture: profile.getImageUrl(),
      });

      this.routeAfterLogin(auth);
    },
  },
  computed: {
    ...mapGetters('profile', [
      'currentProfile',
    ]),
  },
  mounted() {
    if (this.$route.query.hasOwnProperty('code')) {
      console.log('linkedin login');
      console.log(this.$route.query.code);
      // make calls to backend to grab the profile
    }
    gapi.load('auth2', ()=>{
      this.googleOauth = gapi.auth2.init({
        client_id: self.client_id,
        cookiepolicy: 'single_host_origin',
        ux_mode: 'redirect',
        redirect_uri: 'http://localhost:8080/signup',
      });
      this.googleOauth.isSignedIn.listen(this.onGoogleSignIn);
    });
  },
};
</script>

<style scoped>
.parent{
  display: grid;
  height: 100%;
  width: 100%;
}
.btn{
  width: 400px
}
</style>