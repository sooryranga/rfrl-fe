import 'bootstrap/dist/css/bootstrap.min.css';

import Vue from 'vue';
import VueCroppie from 'vue-croppie';
import 'croppie/croppie.css'; // import the croppie css manually
import 'vue-cal/dist/vuecal.css';

import vuetify from '@/plugins/vuetify';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(VueCroppie);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
