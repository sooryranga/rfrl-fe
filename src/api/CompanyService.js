import Vue from 'vue';

export const CompanyService = {
  async getList() {
    const response = await Vue.axios.get(`company/`);
    return response.data;
  },
  async suggest({name, emailDomain}) {
    await Vue.axios.post(`company/suggest/`, {name, emailDomain});
  },
};


export default {CompanyService};
