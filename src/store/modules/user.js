import {PROFILE_PICTURE, NAME} from '@/constants.actions.js';
import {
  SET_PROFILE, SET_PROFILE_IMAGE, SET_NAME,
} from '@/constants.mutations.js';

const state ={
  name: null,
  birthDay: null,
  profileImage: null,
  about: null,
  education: {},
  workExperience: {},
  documentation: {},
};

const getters = {
  currentProfile: (state) => state,
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
    state = {...profile};
  },
  [SET_PROFILE_IMAGE](state, imageSrc) {
    this.state.profileImage = imageSrc;
  },
  [SET_NAME](state, name) {
    this.state.name = name;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
