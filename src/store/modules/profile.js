import {v1 as uuidv1} from 'uuid';

import {PROFILE_PICTURE, NAME} from '@/constants.actions.js';
import {
  SET_PROFILE, SET_PROFILE_IMAGE, SET_NAME,
} from '@/constants.mutations.js';


const state ={
  profile: {
    id: uuidv1(),
    name: null,
    birthDay: null,
    profileImage: null,
    about: null,
    education: {},
    workExperience: {},
    documentation: {},
    isTutor: true,
    tutoredStudents: [],
  },
};

const getters = {
  'getProfile': (state) => state.profile,
};

const actions = {
  [PROFILE_PICTURE]({commit}, image) {
    commit(SET_PROFILE_IMAGE, image);
  },
  [NAME]({commit}, name) {
    commit(SET_NAME, name);
  },
};

const mutations = {
  [SET_PROFILE](state, profile) {
    state.profile = {...profile};
  },
  [SET_PROFILE_IMAGE](state, imageSrc) {
    state.profile.profileImage = imageSrc;
  },
  [SET_NAME](state, name) {
    state.profile.name = name;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
