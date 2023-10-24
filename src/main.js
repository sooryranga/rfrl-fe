import 'bootstrap/dist/css/bootstrap.min.css';

import Vue from 'vue';
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue';
import VueCroppie from 'vue-croppie';
import 'croppie/croppie.css'; // import the croppie css manually
import 'vue-cal/dist/vuecal.css';
import {getToken} from '@/api/Auth';
import ApiService from '@/api/ApiService';
import Vuelidate from 'vuelidate';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(VueCroppie);

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.use(Vuelidate);

ApiService.init();

const token = getToken();

if (token) {
  ApiService.setHeader(token);
};

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
