import Vuex from 'vuex';
import Vue from 'vue';
import questions from './modules/questions';
import profile from './modules/profile';
import chatRooms from './modules/chatRooms';
import roomMessages from './modules/roomMessages';
import listTutors from './modules/listTutors';
import listClients from './modules/listClients';
import companies from './modules/companies';
import conference from './modules/conference';
import tutorReview from './modules/tutorReview';
import reportClient from './modules/reportClient';
import globalModal from './modules/globalModal';

// Load Vuex
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    questions,
    profile,
    chatRooms,
    roomMessages,
    listTutors,
    listClients,
    companies,
    conference,
    tutorReview,
    globalModal,
    reportClient,
  },
});

window.store = store;

// Create store
export default store;
