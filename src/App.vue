<template>
  <div id="app">
    <router-view />
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
  async mounted() {
    if (this.loggedIn) return;
    try {
      await this.loginAuthorized();
    } catch (err) {
      this.$router.push({
        name: 'signup',
      });
      throw err;
    }
  },
};
</script>

<style>
#app {
  height: 100%;
  width: 100vw;
}
:root {
  --clr-primary: #651fff;
  --clr-gray: #37474f;
  --clr-gray-light: #b0bec5;
}
* {
  box-sizing: border-box;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
}
</style>
