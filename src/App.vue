<template>
  <div id="app">
    <router-view />
    <global-modal/>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
import GlobalModal from './components/GlobalModal.vue';

export default {
  name: 'app',
  components: {
    GlobalModal,
  },
  methods: {
    ...mapActions('profile', ['loginAuthorized']),
  },
  async mounted() {
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  flex-flow: column;
  height: 100%;
  z-index: 10;
  width: 100vw;
}
p {
  font-size: 14px;
}
#topnavbar{
  height: 65px;
}
</style>
