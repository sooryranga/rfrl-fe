import {
  SET_LOGGED_IN,
  SET_GOOGLE_AUTH,
  SET_LINKED_IN_AUTH,
  SET_DEFAULT_AUTH,
  SET_LOGGED_OUT,
} from '@/constants.mutations.js';

import {
  GOOGLE_LOGIN,
  LINKED_IN_LOGIN,
  DEFAULT_LOGIN,
  LOGOUT,
} from '@/constants.actions.js';

const blankAuth = {
  google: {token: null},
  linkedin: {token: null},
  default: {username: null, passwordHash: null},
  loggedIn: false,
};

const state = {
  google: {token: null},
  linkedin: {token: null},
  default: {username: null, passwordHash: null},
  loggedIn: false,
};

const getters = {
  loggedIn: (state) => state.loggedIn,
};

const actions = {
  [GOOGLE_LOGIN]({commit}, token) {
    commit(SET_GOOGLE_AUTH, token);
    commit(SET_LOGGED_IN);
  },
  [LINKED_IN_LOGIN]({commit}, token) {
    commit(SET_LINKED_IN_AUTH, token);
    commit(SET_LOGGED_IN);
  },
  [DEFAULT_LOGIN]({commit}, username, password) {
    commit(SET_DEFAULT_AUTH, username, password);
    commit(SET_LOGGED_IN);
  },
  [LOGOUT](context) {
    commit(SET_LOGGED_OUT);
  },
};

const mutations = {
  [SET_LOGGED_IN](state) {
    if (!state.loggedIn) {
      state.loggedIn = true;
    }
  },
  [SET_GOOGLE_AUTH](state, token) {
    state.google.token = token;
  },
  [SET_LINKED_IN_AUTH](state, token) {
    state.linkedin.token = token;
  },
  [SET_DEFAULT_AUTH](state, username, pass) {
    state.default= {username: username, passwordHash: pass};
  },
  [SET_LOGGED_OUT](state) {
    state = {...blankAuth};
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
