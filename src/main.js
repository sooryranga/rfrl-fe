import 'bootstrap/dist/css/bootstrap.min.css';

import Vue from 'vue';
import Vuetify from 'vuetify';
import DaySpanVuetify from 'dayspan-vuetify';
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue';
import VueCroppie from 'vue-croppie';
import 'croppie/croppie.css'; // import the croppie css manually


import App from './App.vue';
import router from './router';
import store from './store';

import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'dayspan-vuetify/dist/lib/dayspan-vuetify.min.css';


Vue.use(VueCroppie);

Vue.use(Vuetify);
// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.use(DaySpanVuetify, {
  methods: {
    getDefaultEventColor: () => '#1976d2',
    getDefaultEventDetails: () => {
      return {
        id: null,
        title: 'Schedule Tutoring',
        description: 'Schedule your tutoring session!',
        user: null,
        location: '',
        color: '#1976d2',
        forecolor: '#ffffff',
        calendar: '',
        busy: true,
        icon: '',
      };
    },
  },
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
