import Vuex from 'vuex';
import Vue from 'vue';
import questions from './modules/questions';
import profile from './modules/profile';
import chatRooms from './modules/chatRooms';
import roomMessages from './modules/roomMessages';
import tutors from './modules/tutors';
import companies from './modules/companies';

// Load Vuex
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    questions,
    profile,
    chatRooms,
    roomMessages,
    tutors,
    companies,
  },
});

window.store = store;

// Create store
export default store;
