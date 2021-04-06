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
  tutorError: (state) => state.error,
  getTutor: (state) => (id) => {
    state.tutors.find((tutor) => tutor.id === id);
  },
};

const actions = {
  async getTutors({commit}) {
    try {
      const tutors = await Client.ClientService.getList(true);
      commit(SET_ADD_TUTORS, tutors);
    } catch (err) {
      console.log(err);
      commit(SET_TUTORS_ERROR, getErrorMessageFromRequest(err));
    }
  },
};

const mutations = {
  [SET_ADD_TUTORS](state, newTutors) {
    const existingTutorIds = new Set();
    state.tutors.forEach((tutor) => {
      existingTutorIds.add(tutor.id);
    });
    const tutors = [...state.tutors];

    newTutors.forEach((tutor) => {
      if (!existingTutorIds.has(tutor.id)) {
        tutors.push(tutor);
      }
    });
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
