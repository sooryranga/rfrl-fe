<template>
<div>
  <div id="google-signin-btn"></div>
  <div id="linkedin-signin-btn">
    <button class="btn"><i :src="`${linkedin_icon}inkedin.png`"></i>Signin</button>
  </div>
</div>
</template>

<script>
export default {
  name: 'SignUp',
  data: function() {
    return {
      publicPath: process.env.BASE_URL,
      client_id: '328728240170-60hudfjvelfulh27l2qvgt69lru146rb.apps.googleusercontent.com', // eslint-disable-line
    };
  },
  methods: {
    onSignIn: function(user) {
      // do stuff, for example
      const profile = user.getBasicProfile();
      console.log('ID: ' + profile.getId());
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());
    },
  },
  mounted: function() {
    console.log(process.env.BASE_URL);
    const self = this;
    gapi.load('auth2', function() {
      gapi.auth2.init({
        client_id: self.client_id,
      })
          .then(()=>{
            gapi.signin2.render('google-signin-btn', {
              onsuccess: self.onSignIn,
              onError: (err) => {
                console.log(err);
              },
            });
          });
    });
  },
};
</script>

<style>

</style>
