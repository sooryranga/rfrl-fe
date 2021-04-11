import Vue from 'vue';
import {Profile} from '.';

export const ClientService = {
  async get(id) {
    const response = await Vue.axios.get(`client/${id}/`);
    return Profile.responseToProfile(response.data);
  },
  async getList(isTutor) {
    const response = await Vue.axios.get(`clients/?is_tutor=${isTutor}`);
    const clients = [];
    for (let i = 0; i < response?.data?.length; i++) {
      const client = response?.data[i];
      clients.push(Profile.responseToProfile(client));
    }
    return clients;
  },
  async getEvents({id, startTime, endTime, state}) {
    const response = await Vue.axios.get(
        `client/${id}/events/`,
        {params: {startTime, endTime, state}},
    );

    return response.data;
  },
};


export default {ClientService};
