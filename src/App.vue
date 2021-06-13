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
@import './css/color.css';
@import './css/tooltip.css';

#app {
  height: 100%;
  width: 100vw;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--clr-gray-9);
}

p {
  max-width: 50ch;
  color: var(--clr-gray-4)
}

.no-styling-button{
  background: none;
  color: inherit;
  border: none;
  padding: 0;
}
</style>
