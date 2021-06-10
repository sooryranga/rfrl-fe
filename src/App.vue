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
  /* Basic Colors */
  --clr-gray-1:#282828;
  --clr-gray-2:#414141;
  --clr-gray-3:#5A5A5A;
  --clr-gray-4:#737373;
  --clr-gray-5:#8C8C8C;
  --clr-gray-6:#A5A5A5;
  --clr-gray-7:#BEBEBE;
  --clr-gray-8:#D7D7D7;
  --clr-gray-9:#fcfcfc;


  --clr-primary-darkest: #3400A3;
  --clr-primary-darker:#4100CC;
  --clr-primary-dark:#4E00F5;
  --clr-primary: #651fff;
  --clr-primary-light: #7C3FFF;
  --clr-primary-lighter: #915FFF;
  --clr-primary-lightest: #A77FFF;
  --clr-primary-bg-color:#f9f7ff;

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

  /*
    PROPERTY COLORS
  */

  /* Button Color */
  --clr-button-primary: white;
  --clr-button-primary-outline: var(--clr-primary);
  --clr-button-secondary: var(--clr-gray-2);
  --clr-button-secondary-outline: white;
}
* {
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


/**
 * Tooltip Styles
 */

/* Add this attribute to the element that needs a tooltip */
[data-tooltip] {
  position: relative;
  z-index: 2;
  cursor: pointer;
}

/* Hide the tooltip content by default */
[data-tooltip]:before,
[data-tooltip]:after {
  visibility: hidden;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
  filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=0);
  opacity: 0;
  pointer-events: none;
}

/* Position tooltip above the element */
[data-tooltip]:before {
  position: absolute;
  bottom: 150%;
  left: 50%;
  margin-bottom: 5px;
  margin-left: -80px;
  padding: 7px;
  width: 160px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  background-color: #000;
  background-color: hsla(0, 0%, 20%, 0.9);
  color: #fff;
  content: attr(data-tooltip);
  text-align: center;
  font-size: 14px;
  line-height: 1.2;
}

/* Triangle hack to make tooltip look like a speech bubble */
[data-tooltip]:after {
  position: absolute;
  bottom: 150%;
  left: 50%;
  margin-left: -5px;
  width: 0;
  border-top: 5px solid #000;
  border-top: 5px solid hsla(0, 0%, 20%, 0.9);
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
  content: " ";
  font-size: 0;
  line-height: 0;
}

/* Show tooltip content on hover */
[data-tooltip]:hover:before,
[data-tooltip]:hover:after {
  visibility: visible;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
  filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=100);
  opacity: 1;
}
</style>
