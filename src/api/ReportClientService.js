import Vue from 'vue';

export const ReportClientService = {
  async report({accused, cause}) {
    await Vue.axios.post(
        `report/`,
        {accused, cause},
    );
  },
};


export default {ReportClientService};
