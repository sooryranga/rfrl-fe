<template>
<div>
  <div class="row">
    <div class="col">
    </div>
    <div class="col">
      <div class="h-50 parrent">
        <div id="google-signin-btn">
          <button class="btn" v-on:click="loginToGoogle"><i class="fab fa-google"></i> Signin </button>
        </div>
        <div id="linkedin-signin-btn">
          <button class="btn" v-on:click="loginToLinkedIn"><i class="fab fa-linkedin"></i> Signin</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
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
      this.user = this.googleOauth.currentUser.get();
      // do stuff, for example
      const profile = this.user.getBasicProfile();
      console.log('ID: ' + profile.getId());
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());
    },
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

<style>

</style>
