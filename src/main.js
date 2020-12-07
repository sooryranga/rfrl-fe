import 'bootstrap/dist/css/bootstrap.min.css';

import Vue from 'vue';
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue';
import VueCroppie from 'vue-croppie';
import 'croppie/croppie.css'; // import the croppie css manually
import 'vue-cal/dist/vuecal.css';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(VueCroppie);

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
