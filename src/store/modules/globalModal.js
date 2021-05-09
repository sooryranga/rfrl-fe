import {
  SET_GLOBAL_MODAL,
} from '@/constants.mutations.js';

const state = {
  showGlobalModal: true,
};

const getters = {
  showGlobalModal: (state) => {
    return state.showGlobalModal;
  },
};

const actions = {
  preventShowingGlobalModal({commit, getters}) {
    if (!getters.showGlobalModal) return;

    commit(SET_GLOBAL_MODAL, false);
    setTimeout(()=>{
      commit(SET_GLOBAL_MODAL, true);
    }, 3000);
  },
};


const mutations = {
  [SET_GLOBAL_MODAL](state, showGlobalModal) {
    state.showGlobalModal = showGlobalModal;
  },
};


export default {
  state,
  getters,
  actions,
  namespaced: true,
  mutations,
};
