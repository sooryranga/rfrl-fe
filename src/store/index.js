import Vuex from 'vuex';
import Vue from 'vue';
import auth from './modules/authentication';
import question from './modules/questions'; 

// Load Vuex
Vue.use(Vuex);

// Create store
export default new Vuex.Store({
  modules: {
    auth,
    question
  }
});