<template>
  <div id="app">
    <router-view :key="routerViewKey"/>
  </div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
  name: 'tutor',
  computed: {
    routerViewKey() {
      return this.$route.fullPath.split('/').slice(0, 2).join('/');
    },
  },
  methods: {
    ...mapActions('profile', ['loginAuthorized']),
  },
  async mounted() {
    await this.loginAuthorized();
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
