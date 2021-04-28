import Vue from 'vue';

export const ConferenceService = {
  async submitCode({sessionId, code, language}) {
    const response = await Vue.axios.post(
        `conference-session/${sessionId}/code/`,
        {code, language},
    );
    return response.data;
  },
};


export default {ConferenceService};
