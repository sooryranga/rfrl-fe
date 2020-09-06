import Vuex from 'vuex';
import Vue from 'vue';
import auth from './modules/authentication';

// Load Vuex
Vue.use(Vuex);

// Create store
export default new Vuex.Store({
  modules: {
    auth
  }
});