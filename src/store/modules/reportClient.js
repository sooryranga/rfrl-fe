import {ReportClient} from '@/api';

import {
  SET_PENDING_REPORT_CLIENT,
} from '@/constants.mutations.js';

const state = {
  accusedClient: null,
};

const getters = {
  accusedClient: (state) => state.accusedClient,
};

const actions = {
  setAccusedClient({commit}, client) {
    commit(SET_PENDING_REPORT_CLIENT, client);
  },
  async report({commit, getters}, {cause}) {
    if (getters.accusedClient === null) return;

    await ReportClient.ReportClientService.report({
      accused: getters.accusedClient.ID,
      cause,
    });

    commit(SET_PENDING_REPORT_CLIENT, null);
  },
};

const mutations = {
  [SET_PENDING_REPORT_CLIENT](state, client) {
    state.accusedClient = client;
  },
};

export default {
  state,
  getters,
  actions,
  namespaced: true,
  mutations,
};
