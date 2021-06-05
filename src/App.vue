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
  --clr-gray-1:#282828;
  --clr-gray-2:#414141;
  --clr-gray-3:#5A5A5A;
  --clr-gray-4:#737373;
  --clr-gray-5:#8C8C8C;
  --clr-gray-6:#A5A5A5;
  --clr-gray-7:#BEBEBE;
  --clr-gray-8:#D7D7D7;
  --clr-gray-9:#F0F0F0;


  --clr-primary-darkest: #3400A3;
  --clr-primary-darker:#4100CC;
  --clr-primary-dark:#4E00F5;
  --clr-primary: #651fff;
  --clr-primary-light: #7C3FFF;
  --clr-primary-lighter: #915FFF;
  --clr-primary-lightest: #A77FFF;

  --clr-success-darkest: #00723B;
  --clr-success-darker: #008E49;
  --clr-success-dark: #00AA58;
  --clr-success: #00C767;
  --clr-success-light: #00F37E;
  --clr-success-lighter:#21FF94;
  --clr-success-lightest: #4DFFA9;

  --clr-error-darkest: #7B0317;
  --clr-error-darker: #9A031C;
  --clr-error-dark: #B80422;
  --clr-error: #d90429;
  --clr-error-light: #FA0B33;
  --clr-error-lighter: #FB3455;
  --clr-error-lightest: #FC5C77;

  --clr-warning-darkest: #8F5F06;
  --clr-warning-darker: #B27707;
  --clr-warning-dark: #D68E09;
  --clr-warning: #F5A40D;
  --clr-warning-light: #F6B131;
  --clr-warning-lighter: #F8BE54;
  --clr-warning-lightest: #F9CB76;


  --clr-background: #D1B8A9;
  --clr-secondary: #683067;
  --clr-gray: #37474f;
  --clr-gray-light: #b0bec5;
}
* {
  box-sizing: border-box;
  font-family: Noto Sans JP, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  font-weight: 300;
  background-color: var(--clr-gray-9);
}

p {
  max-width: 50ch;
}
</style>
