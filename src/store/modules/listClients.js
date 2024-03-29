import {Client} from '@/api';
import {getErrorMessageFromRequest} from '@/utils';

import {
  SET_ADD_CLIENTS,
  SET_CLIENTS_ERROR,
  SET_CLIENTS,
} from '@/constants.mutations.js';

const state = {
  error: null,
  clients: [],
};

const getters = {
  clients: (state) => state.clients,
  clientError: (state) => state.error,
  getClient: (state) => (id) => {
    state.clients.find((client) => client.id === id);
  },
};

const actions = {
  async getClients({commit, getters}, {wantingReferralCompanyId}) {
    const clients = getters.clients;
    const lastClient = clients.length > 0 ?
      clients[clients.length-1].id :
      undefined;

    try {
      const clients = await Client.ClientService.getList({
        wantingReferralCompanyId,
        lastClient,
      });
      commit(SET_CLIENTS, clients);
      return clients;
    } catch (err) {
      commit(SET_CLIENTS_ERROR, getErrorMessageFromRequest(err));
    }
  },
};

const mutations = {
  [SET_CLIENTS](state, clients) {
    state.clients = [...state.clients, ...clients];
  },
  [SET_ADD_CLIENTS](state, newClients) {
    const clients = [...state.clients, ...newClients];
    state.clients = clients;
  },
  [SET_CLIENTS_ERROR](state, error) {
    state.error = error;
  },
};

export default {
  state,
  getters,
  actions,
  namespaced: true,
  mutations,
};
