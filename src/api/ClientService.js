import Vue from 'vue';
import {Profile} from '.';
import qs from 'qs';

export const ClientService = {
  async get(id) {
    const response = await Vue.axios.get(`client/${id}/`);
    return Profile.responseToProfile(response.data);
  },
  async getList({
    isTutor, fromCompanyIds, wantingReferralCompanyId, lastTutor,
  }) {
    const response = await Vue.axios.get(
        `clients/`,
        {
          params: {
            isTutor, fromCompanyIds, wantingReferralCompanyId, lastTutor,
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, {indices: false});
          },
        },
    );
    const clients = [];
    for (let i = 0; i < response?.data?.length; i++) {
      const client = response?.data[i];
      clients.push(Profile.responseToProfile(client));
    }
    return clients;
  },
  async getEvents({id, start, end, state}) {
    const response = await Vue.axios.get(
        `client/${id}/events/`,
        {params: {start, end, state}},
    );

    return response.data;
  },
};


export default {ClientService};
