import {Client} from '@/api';
import {getErrorMessageFromRequest} from '@/utils';

import {
  SET_ADD_TUTORS,
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
    state.tutors.find((tutor) => tutor.id === id);
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
    const tutors = getters.tutors;
    let lastTutor = tutors.length > 0 ? tutors[tutors.length-1].id : undefined;
    let mutation = SET_ADD_TUTORS;

    if (reset) {
      lastTutor = undefined;
      mutation = SET_TUTORS;
    }

    try {
      const tutors = await Client.ClientService.getList({
        isTutor: true,
        ...params,
        lastClient: lastTutor,
      });

      commit(mutation, tutors);
      return tutors;
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
  [SET_ADD_TUTORS](state, newTutors) {
    const tutors = [...state.tutors, ...newTutors];
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
