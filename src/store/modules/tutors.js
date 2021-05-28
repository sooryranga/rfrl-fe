import {Client} from '@/api';
import {getErrorMessageFromRequest} from '@/utils';

import {
  SET_ADD_TUTORS,
  SET_TUTORS_ERROR,
  SET_TUTORS,
} from '@/constants.mutations.js';

const state = {
  error: null,
  tutors: [],
};

const getters = {
  tutors: (state) => state.tutors,
  tutorError: (state) => state.error,
  getTutor: (state) => (id) => {
    state.tutors.find((tutor) => tutor.id === id);
  },
};

const actions = {
  async getTutors({commit}, {fromCompanyIds}) {
    try {
      const tutors = await Client.ClientService.getList({
        isTutor: true,
        fromCompanyIds,
      });
      commit(SET_TUTORS, tutors);
    } catch (err) {
      commit(SET_TUTORS_ERROR, getErrorMessageFromRequest(err));
    }
  },
};

const mutations = {
  [SET_TUTORS](state, tutors) {
    state.tutors = tutors;
  },
  [SET_ADD_TUTORS](state, newTutors) {
    const tutors = [...state.tutors, ...newTutors];
    state.tutors = tutors;
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
