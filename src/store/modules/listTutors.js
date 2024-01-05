import {Client} from '@/api';
import {getErrorMessageFromRequest} from '@/utils';

import {
  SET_TUTORS_ERROR,
  SET_TUTORS,
  SET_TUTOR_PARAMS,
} from '@/constants.mutations.js';

const state = {
  error: null,
  tutors: [],
  params: {},
};

const getters = {
  tutors: (state) => state.tutors,
  tutorError: (state) => state.error,
  getTutor: (state) => (id) => {
    return state.tutors.find((tutor) => tutor.id === id);
  },
  params: (state) => state.params,
};

const actions = {
  async updateParams({commit, getters}, {fromCompanyIds}) {
    const params = getters.params;
    const updateParams = params.fromCompanyIds != fromCompanyIds;
    if (!updateParams) return;

    commit(SET_TUTOR_PARAMS, {fromCompanyIds});
  },
  async getTutors({commit, getters}, {reset=false}) {
    const params = getters.params;
    const existingTutors = getters.tutors;
    const lastTutor = existingTutors.length > 0 && !reset ?
      existingTutors[existingTutors.length-1].id :
      undefined;

    try {
      const newTutors = await Client.ClientService.getList({
        isTutor: true,
        ...params,
        lastClient: lastTutor,
      });
      const tutors = reset ?
        newTutors:
        [...existingTutors, ...newTutors];

      commit(SET_TUTORS, tutors);
      return newTutors;
    } catch (err) {
      commit(SET_TUTORS_ERROR, getErrorMessageFromRequest(err));
      return [];
    }
  },
};

const mutations = {
  [SET_TUTORS](state, tutors) {
    state.tutors = tutors;
  },
  [SET_TUTORS_ERROR](state, error) {
    state.error = error;
  },
  [SET_TUTOR_PARAMS](state, params) {
    state.params = params;
    state.tutors = [];
  },
};

export default {
  state,
  getters,
  actions,
  namespaced: true,
  mutations,
};
