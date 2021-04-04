import {Client} from '@/api';
import {getErrorMessageFromRequest} from '@/utils';

import {
  SET_ADD_TUTORS,
  SET_TUTORS_ERROR,
} from '@/constants.mutations.js';

const state = {
  error: null,
  tutors: [],
};

const getters = {
  tutors: (state) => state.tutors,
};

const actions = {
  async getTutors({commit}) {
    try {
      const tutors = Client.ClientService.getList(true);
      commit(SET_ADD_TUTORS, tutors);
    } catch (err) {
      commit(SET_TUTORS_ERROR, getErrorMessageFromRequest(err));
    }
  },
};

const mutations = {
  [SET_ADD_TUTORS](state, questions) {
    state.tutors = [...state.tutors, ...questions];
  },
  [SET_TUTORS_ERROR](state, error) {
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
