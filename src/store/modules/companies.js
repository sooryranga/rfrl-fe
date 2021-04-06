import {Company} from '@/api';

import {getErrorMessageFromRequest} from '@/utils';

import {
  SET_COMPANIES,
  SET_COMPANIES_ERROR,
} from '@/constants.mutations.js';

const state = {
  error: null,
  companies: [],
};

const getters = {
  companies: (state) => state.companies,
  companyError: (state) => state.error,
};

const actions = {
  async getCompanies({commit}) {
    try {
      const companies = await Company.CompanyService.getList();
      commit(SET_COMPANIES, companies);
    } catch (err) {
      console.log(err);
      commit(SET_COMPANIES_ERROR, getErrorMessageFromRequest(err));
    }
  },
};

const mutations = {
  [SET_COMPANIES](state, companies) {
    state.companies = companies;
  },
  [SET_COMPANIES_ERROR](state, error) {
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
