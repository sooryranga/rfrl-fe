import {Company} from '@/api';

import {getErrorMessageFromRequest} from '@/utils';

import {
  SET_COMPANY,
  SET_COMPANY_ERROR,
} from '@/constants.mutations.js';

const state = {
  error: null,
  companies: [],
};

const getters = {
  companies: (state) => state.companies,
};

const actions = {
  async getCompanies({commit}) {
    try {
      const companies = Company.CompanyService.getList();
      commit(SET_COMPANY, companies);
    } catch (err) {
      commit(SET_COMPANY_ERROR, getErrorMessageFromRequest(err));
    }
  },
};

const mutations = {
  [SET_COMPANY](state, companies) {
    state.companies = companies;
  },
  [SET_COMPANY_ERROR](state, error) {
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
