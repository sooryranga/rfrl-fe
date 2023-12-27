import Vue from 'vue';

export const CompanyService = {
  async getList() {
    const response = await Vue.axios.get(`company/`);
    return response.data;
  },
};


export default {CompanyService};
