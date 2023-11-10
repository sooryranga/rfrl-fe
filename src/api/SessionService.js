import Vue from 'vue';

export const SessionService = {
  async getSessionForProfile() {
    const response = await Vue.axios.get(
        `sessions/`,
        null,
        {state: 'scheduled'},
    );
    return response.data;
  },
  async getPrendingSession(roomId) {
    const response = await Vue.axios.get(
        `sessions/`,
        null,
        {params: {room_id: roomId, state: 'pending'}},
    );
    return response.data;
  },
  async getScheduledSessions(roomId) {
    return await Vue.axios.get(
        `sessions/`,
        null,
        {params: {room_id: roomId, state: 'scheduled'}},
    );
  },
  async selectSessionDates(id, eventIds, replace=false) {
    return await Vue.axios.post(
        `session/${id}/event/`,
        {events: eventIds, replace},
    );
  },
  async unselectSessionDates(id, eventIds) {
    return await Vue.axios.delete(`session/${id}/event/`, {events: eventIds});
  },
  async get(id) {
    return await Vue.axios.get(`session/${id}`);
  },
  async save(id, session) {
    return await Vue.axios.put(`session/${id}`, session);
  },
  async create({session}) {
    const response = await Vue.axios.post(`session/`, session);

    return response.data;
  },
  async delete(id) {
    return await Vue.axios.delete(`session/${id}/`);
  },
};


export default {SessionService};
