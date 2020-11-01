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
        <form class="text-left">
          <div class="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input
              type="email" class="form-control" id="exampleInputEmail1"
              aria-describedby="emailHelp" placeholder="Enter email">
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
          </div>
          <button type="submit" class="btn btn-primary mt-3">Register</button>
          </form>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {
  GOOGLE_LOGIN,
  LINKED_IN_LOGIN,
  DEFAULT_LOGIN,
  NAME,
  PROFILE_PICTURE,
} from '@/constants.actions.js';
import {GET_PROFILE} from '@/constants.getters.js';
import {mapActions, mapGetters} from 'vuex';
import queryString from 'query-string';


export default {
  name: 'SignUp',
  data: function() {
    return {
      publicPath: process.env.BASE_URL,
      user: null,
      googleOauth: null,
      google_client_id: '328728240170-60hudfjvelfulh27l2qvgt69lru146rb.apps.googleusercontent.com', // eslint-disable-line
    };
  },
  methods: {
    loginToLinkedIn: function() {
      window.location.replace(this.linkedinOauthUrl);
    },
    loginToGoogle: function() {
      this.googleOauth.signIn();
    },
    onGoogleSignIn: function(hasUser) {
      if (!hasUser) {
        console.log('Need to reauth');
        return;
      }
      const googleUser = this.googleOauth.currentUser.get();
      const idToken = googleUser.getAuthResponse().id_token;

      const profile = googleUser.getBasicProfile();
      console.log('ID: ' + profile.getId());
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());
      console.log('token: ' + idToken);
      this[GOOGLE_LOGIN](idToken);
      this[NAME](profile.getName());
      this[PROFILE_PICTURE](profile.getImageUrl());
      this.$router.push(
          {name: 'Profile', params: {userId: this[GET_PROFILE].id}},
      );
    },
    ...mapActions('authentication', [
      GOOGLE_LOGIN,
      LINKED_IN_LOGIN,
      DEFAULT_LOGIN,
    ]),
    ...mapActions('profile', [
      NAME,
      PROFILE_PICTURE,
    ]),
    ...mapGetters('profile', [
      GET_PROFILE,
    ]),
  },
  computed: {
    linkedinOauthUrl: function() {
      return 'https://www.linkedin.com/oauth/v2/authorization?' +
      queryString.stringify(
          {
            response_type: 'code',
            client_id: '780irx50xypror',
            redirect_uri: 'http://localhost:8080/signup/',
            scope: ['r_liteprofile', 'r_emailaddress'],
          },
      );
    },
  },
  mounted: function() {
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
