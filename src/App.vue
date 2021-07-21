<template>
  <div id="app">
    <router-view/>
    <global-modal/>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import GlobalModal from './components/GlobalModal.vue';

export default {
  name: 'app',
  components: {
    GlobalModal,
  },
  computed: {
    ...mapGetters('profile', ['loggedIn']),
  },
  methods: {
    ...mapActions('profile', ['loginAuthorized']),
  },
  watch: {
    '$route.name': function() {
      if (this.loggedIn) return;

      this.loginAuthorized()
          .then(()=>{
            if (this.$route.name === 'signup') {
              this.$router.push({
                name: 'home',
              });
            }
          })
          .catch((err)=>{
            if (this.$route.name === 'signup') return;
            console.log(err);
            this.$router.push({
              name: 'signup',
            });
          });
    },
  },
};
</script>

<style>
@import './css/color.css';
@import './css/tooltip.css';
@import './css/button.css';

#app {
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--clr-background-light);
}

p {
  max-width: 50ch;
  color: var(--clr-gray-4)
}
</style>
