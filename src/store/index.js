import Vuex from 'vuex';
import Vue from 'vue';
import authentication from './modules/authentication';
import questions from './modules/questions';
import profile from './modules/profile';
import chatRooms from './modules/chatRooms';
import roomMessages from './modules/roomMessages';

// Load Vuex
Vue.use(Vuex);

// Create store
export default new Vuex.Store({
  modules: {
    authentication,
    questions,
    profile,
    chatRooms,
    roomMessages,
  },
});
